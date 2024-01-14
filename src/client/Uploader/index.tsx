import React, { ChangeEvent, useContext, useRef, useState } from 'react';

import AppContext from '../AppContext';
import FileSize from '../components/FileSize';
import Action from '../components/Action';
import { fetchApi } from '../fetcher';
import { IFileItem, IFileTask, IResultForPollFileTask } from '../types';

import { arrayBufferToBase64 } from './converter';
import './index.less';

export default function Uploader(): React.ReactElement {
  const { workPath } = useContext(AppContext);

  const refInput = useRef<HTMLInputElement>(null);
  const refProgress = useRef<number>(0);
  const [stateFileItem, setStateFileItem] = useState<IFileItem & { rawValue: File }>();
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

  const raiseUploadByHTTP = async (): Promise<void> => {
    if (!stateFileItem) { return; }
    console.log({ stateFileItem });
    const { fileTask: startFileTask } = await fetchApi<IResultForPollFileTask>('pollFileTask', {
      filePath: stateFileItem.filePath,
      fileSize: stateFileItem.fileSize,
      fileHash: ''
    });
    setStateFileTask(startFileTask);

    const taskId = startFileTask.taskId;
    const blobSize = 4 * 1024 * 1024; // 4KB
    const fileItem = stateFileItem.rawValue;
    const fileSize = stateFileItem.fileSize;

    refProgress.current = 0;

    let blobHead = 0;
    while (blobHead < fileSize) {
      let blobTail = blobHead + blobSize;
      if (blobTail > fileSize) { blobTail = fileSize; };
      const fileSlice = fileItem.slice(blobHead, blobTail);
      const blobArrayBuffer = await fileSlice.arrayBuffer();
      const actualBlobSize = blobTail - blobHead;
      fetchApi('pushFilePart', {
        taskId,
        blobHead,
        blobSize: actualBlobSize,
        blobData: arrayBufferToBase64(blobArrayBuffer)
      }).then(() => {
        refProgress.current += actualBlobSize;
        setStateFileTask({ ...startFileTask });
      });
      // TODO: retry if network error
      blobHead += actualBlobSize;
    }

    while (true) {
      const { fileTask } = await fetchApi<IResultForPollFileTask>('pollFileTask', { taskId });
      setStateFileTask(fileTask);
      if (['success', 'failure'].includes(fileTask.taskResult.status)) { break; }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const raiseUploadBySide = async (): Promise<void> => {
    console.log({ stateFileItem });
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
      <div className="controls">
        <div className="input">
          <input ref={refInput} type="file" onChange={inputFile} />
          <Action text="select file" icon="folder_open" onClick={() => refInput.current?.click()} />
        </div>
        <Action text="upload file by HTTP" icon="http" onClick={raiseUploadByHTTP} />
        <Action text="upload file by Side" icon="sensors" onClick={raiseUploadBySide} />
      </div>
    </div>
  );
}