import fs from 'fs';
import os from 'os';

import { IFileTask } from './types.js';

export interface IFilePart {
  blobHead: number;
  blobSize: number;
  blobData: string;
  disposed: boolean;
}

export interface IFileTaskInner extends IFileTask {
  transfer: {
    fileParts: IFilePart[];
    writeStream: fs.WriteStream;
    taskPromise?: Promise<void>
  };
}

export interface IApiState {
  workPath: string;

  fileTasks: {
    [taskId: string]: IFileTaskInner;
  };
};

// TODO: move this into services
const apiState: IApiState = {
  workPath: os.homedir(),

  fileTasks: {}
};

export default apiState;
