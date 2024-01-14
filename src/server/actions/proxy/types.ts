export interface IHostInfo {
  hostIPv4: string;
  hostPort: number;
}

export interface IFileItem {
  fileName: string;
  filePath: string;
  fileSize: number;
  itemType: 'file' | 'directory' | 'other';
  mimeType: string;
}

export interface IFileTask {
  taskId: string;
  timeCreatedAt: number;
  filePath: string;
  fileSize: number;
  fileHash: string;
  taskResult: {
    status: 'pending' | 'working' | 'success' | 'failure';
    reason?: string;
  };
}