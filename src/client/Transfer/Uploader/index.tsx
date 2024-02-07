import React, { ChangeEvent, useContext, useRef, useState } from 'react';

import AppContext from '../../AppContext';
import FileSize from '../../components/FileSize';
import Action from '../../components/Action';
import { fetchApi } from '../../fetcher';
import { IFileItem, IFileTask, IResultForPollFilePart, IResultForPollFileTask } from '../../types';

import { arrayBufferToBase64, stringToImageDataByCTRC, drawImageDataByQR } from '../coder';
import './index.less';

interface IFileItemToUpload extends IFileItem {
  rawValue: File;
}

export default function Uploader(): React.ReactElement {
  const { workPath } = useContext(AppContext);

  const refInput = useRef<HTMLInputElement>(null);
  const refImage = useRef<HTMLCanvasElement>(null);
  const refProgress = useRef<number>(0);
  const [stateFileItem, setStateFileItem] = useState<IFileItemToUpload>();
  const [stateFileTask, setStateFileTask] = useState<IFileTask>();

  const inputFile = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = e.target.files;
    if (!files) { return; }
    const file = files[0];
    setStateFileItem({
      fileName: file.name,
      fileSize: file.size,
      filePath: `${workPath}/${file.name}`,
      mimeType: file.type,
      itemType: 'file',
      rawValue: file
    });
    // TODO: calc hash
  };

  const raiseUploadPartsByHTTP = async (fileTask: IFileTask, fileItem: IFileItemToUpload): Promise<void> => {
    const blobSize = 4 * 1024 * 1024; // 4MB

    const fileSize = fileItem.fileSize;
    const fileData = fileItem.rawValue;

    const tasksForFilePart: Promise<void>[] = [];
    let blobHead = 0;
    while (blobHead < fileSize) {
      let blobTail = blobHead + blobSize;
      if (blobTail > fileSize) { blobTail = fileSize; };
      const actualBlobSize = blobTail - blobHead;
      const fileSlice = fileData.slice(blobHead, blobTail);
      const blobArrayBuffer = await fileSlice.arrayBuffer();
      const filePartPayload = {
        taskId: fileTask.taskId,
        blobHead,
        blobSize: actualBlobSize,
        blobData: arrayBufferToBase64(blobArrayBuffer)
      };
      const taskForFilePart = fetchApi('pushFilePart', filePartPayload).then(() => {
        refProgress.current += actualBlobSize;
        setStateFileTask({ ...fileTask });
      });
      tasksForFilePart.push(taskForFilePart);
      blobHead += actualBlobSize;
    }
    await Promise.all(tasksForFilePart);
  };

  /**
   * 0. start firecell server only in the receiver [b]
   * 1. open uploader page in file provider device [a]
   * 2. open receiver page in file consumer device [b]
   * 3. start [b] side channel [scb] such as camera
   * 4. raise upload in [a] and ready side channel [sca]
   * 5. [a] push other frames for file parts to [sca] and call [b] api to pollFilePart
   * 6. [b] read other frames from [scb] and write to file stream
   */
  const raiseUploadPartsBySide = async (fileTask: IFileTask, fileItem: IFileItemToUpload): Promise<void> => {
    if (!refImage.current) { return; }

    // only for CTRC experiment
    // const blobSize = 1 * 1024 * 1024;
    // const imageWidth = 128;
    // const imageScale = 4;
    // const imageActualWidth = imageWidth * imageScale;
    // refImage.current.width = imageActualWidth;
    // refImage.current.height = imageActualWidth + 64;

    const blobSize = 1 * 256; // QR => 0.25KB for mobile / 1KB for PC

    const fileSize = fileItem.fileSize;
    const fileData = fileItem.rawValue;

    let blobHead = 0;
    while (blobHead < fileSize) {
      let blobTail = blobHead + blobSize;
      if (blobTail > fileSize) { blobTail = fileSize; };
      const actualBlobSize = blobTail - blobHead;
      const fileSlice = fileData.slice(blobHead, blobTail);
      const blobArrayBuffer = await fileSlice.arrayBuffer();
      const filePartPayload = JSON.stringify({
        taskId: fileTask.taskId,
        blobHead,
        blobSize: actualBlobSize,
        blobData: arrayBufferToBase64(blobArrayBuffer)
      });
      // only for CTRC experiment
      // const context = refImage.current.getContext('2d');
      // if (!context) { return; }  
      // const imageDataBuffer = stringToImageDataByCTRC(filePartPayload, imageScale, imageWidth);
      // const imageData = context.createImageData(imageActualWidth, Math.ceil(filePartPayload.length / imageWidth) * imageScale);
      // imageData.data.set(imageDataBuffer);
      // context.clearRect(0, 0, imageActualWidth, imageActualWidth + 64);
      // context.putImageData(imageData, 0, 0);

      // push other frames and poll file parts for working
      await drawImageDataByQR(refImage.current, filePartPayload);
      while (true) {
        const { filePart } = await fetchApi<IResultForPollFilePart>('pollFilePart', { taskId: fileTask.taskId, blobHead });
        if (filePart) { break; }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      refProgress.current += actualBlobSize;
      setStateFileTask({ ...fileTask });
      blobHead += actualBlobSize;
    }
  };

  const raiseUpload = async (mode: 'http' | 'side'): Promise<void> => {
    if (!['http', 'side'].includes(mode)) { return; }
    if (!stateFileItem) { return; }
    console.log({ stateFileItem });

    const { fileTask: startFileTask } = await fetchApi<IResultForPollFileTask>('pollFileTask', {
      filePath: stateFileItem.filePath,
      fileSize: stateFileItem.fileSize,
      fileHash: ''
    });
    setStateFileTask(startFileTask);

    refProgress.current = 0;
    if (mode === 'http') {
      await raiseUploadPartsByHTTP(startFileTask, stateFileItem);
    } else {
      await raiseUploadPartsBySide(startFileTask, stateFileItem).catch(error => {
        window.alert(error.message);
        throw error;
      });
    }

    while (true) {
      const { fileTask } = await fetchApi<IResultForPollFileTask>('pollFileTask', {
        taskId: startFileTask.taskId
      });
      setStateFileTask(fileTask);
      if (['success', 'failure'].includes(fileTask.taskResult.status)) { break; }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const renderTransfer = (): React.ReactElement => {
    if (!stateFileItem || !stateFileTask) { return <></>; }
    const transferRatio = refProgress.current / stateFileItem.fileSize * 100.0;
    const transferSpeed = (refProgress.current / 1024 / 1024) / ((Date.now() - stateFileTask.timeCreatedAt) / 1000);
    return (<>
      <FileSize value={stateFileItem.fileSize} />
      <FileSize value={refProgress.current} />
      <span>{transferRatio.toFixed(2)}%</span>
      <span>{transferSpeed.toFixed(2)}MB/s</span>
    </>);
  };

  return (
    <div className="uploader">
      <div className="info-card file-item">
        {stateFileItem && (
          <div className="value">
            <div>{stateFileItem.fileName}</div>
            <div>{stateFileItem.mimeType}</div>
            <div><FileSize value={stateFileItem.fileSize} /></div>
          </div>
        )}
        {!stateFileItem && (
          <div className="error">no file selected</div>
        )}
      </div>
      {stateFileItem && (
        <div className="info-card file-task">
          <div className="value">
            <div>{stateFileItem.filePath}</div>
            {stateFileTask && (<>
              <div>{stateFileTask.taskResult.status}</div>
              <div>{renderTransfer()}</div>
            </>)}
          </div>
        </div>
      )}
      <div className="area-side-channel">
        <canvas ref={refImage} />
      </div>
      <div className="controls">
        <input ref={refInput} type="file" onChange={inputFile} />
        <Action text="select file" icon="folder_open" onClick={() => refInput.current?.click()} />
        <Action text="upload file by HTTP" icon="http" onClick={() => raiseUpload('http')} />
        <Action text="upload file by side channel" icon="sensors" onClick={() => raiseUpload('side')} />
      </div>
    </div>
  );
}