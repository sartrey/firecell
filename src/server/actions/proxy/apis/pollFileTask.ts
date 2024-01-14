import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import { IApiState, IFileTaskInner } from '../state.js';
import { IFileTask } from '../types.js';

interface IParams {
  taskId?: string;
  filePath?: string;
  fileSize?: number;
  fileHash?: string;
}

interface IResult {
  fileTask: IFileTask;
};

function getBufferFromBase64(blobData: string): Buffer {
  const blobText = atob(blobData);
  return Buffer.from(blobText, 'binary');
}

async function performFileTransfer(fileTask: IFileTaskInner): Promise<void> {
  const transfer = fileTask.transfer;
  const fileSize = fileTask.fileSize;

  let nextBlobHead = 0;
  let retriedTimes = 0;
  while (nextBlobHead < fileSize) {
    const nextFilePart = transfer.fileParts.find(e => e.blobHead === nextBlobHead);
    if (!nextFilePart) {
      if (retriedTimes > 30) {
        throw new Error('retried for next file part too many times');
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      retriedTimes += 1;
      continue;
    }
    const buffer = getBufferFromBase64(nextFilePart.blobData);
    fileTask.transfer.writeStream.write(buffer);
    nextFilePart.disposed = true;
    nextFilePart.blobData = '';
    nextBlobHead += nextFilePart.blobSize;
  }

  await new Promise(resolve => {
    fileTask.transfer.writeStream.end(resolve);
  });
}

export default async function pollFileTask(params: IParams, state: IApiState): Promise<IResult> {
  let fileTask: IFileTaskInner = state.fileTasks[params.taskId || ''];
  if (!fileTask) {
    if (params.filePath) {
      const nextTaskItem: IFileTaskInner = {
        taskId: uuidv4(),
        filePath: params.filePath,
        fileSize: params.fileSize || 0,
        fileHash: params.fileHash || '',
        timeCreatedAt: Date.now(),
        taskResult: {
          status: 'pending'
        },
        transfer: {
          writeStream: fs.createWriteStream(params.filePath),
          fileParts: []
        },
      };
      state.fileTasks[nextTaskItem.taskId] = nextTaskItem;
      fileTask = nextTaskItem;
    } else {
      throw new Error('task not found');
    }
  }

  if (!fileTask.transfer.taskPromise) {
    fileTask.taskResult.status = 'working';
    // do NOT await here
    fileTask.transfer.taskPromise = performFileTransfer(fileTask)
      .then(() => {
        fileTask.taskResult.status = 'success';
      })
      .catch(error => {
        fileTask.taskResult.status = 'failure';
        fileTask.taskResult.reason = error.message;
      });
  }
  
  return {
    fileTask: Object.assign({}, fileTask, { transfer: undefined })
  };
}
