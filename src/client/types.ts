export interface IHostInfo {
  hostIPv4: string;
  hostPort: number;
}

export interface IFileItem {
  fileName: string;
  filePath: string;
  fileSize: number;
  fileHash?: string;
  itemType: 'file' | 'directory' | 'other';
  mimeType: string;

  fileUUID: string;
}

export interface IFileTask {
  taskId: string;
  filePath: string;
  fileSize: number;
  fileHash: string;
  timeCreatedAt: number;
  taskResult: {
    status: 'pending' | 'working' | 'success' | 'failure';
    reason?: string;
  };
}

export interface IResultForListFiles {
  workPath: string;
  fileItems: IFileItem[];
}

export interface IResultForPollFileTask {
  fileTask: IFileTask;
}