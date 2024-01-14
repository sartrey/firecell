import { IApiState } from '../state.js';

interface IParams {
  taskId: string;
  blobHead: number;
  blobSize: number;
  blobData: string;
}

interface IResult {}

export default async function pushFilePart(params: IParams, state: IApiState): Promise<IResult> {
  const { taskId, blobHead, blobSize, blobData } = params;
  const fileTask = state.fileTasks[taskId];
  if (!fileTask) {
    throw new Error(`task [${taskId}] not found`);
  }
  fileTask.transfer.fileParts.push({
    blobHead,
    blobSize,
    blobData,
    disposed: false
  });
  return {};
}