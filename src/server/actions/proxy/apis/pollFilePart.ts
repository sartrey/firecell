import { IApiState } from '../state.js';

interface IParams {
  taskId: string;
  blobHead: number;
}

interface IResult {
}

export default async function pollFilePart(params: IParams, state: IApiState): Promise<IResult> {
  const { taskId, blobHead } = params;
  const fileTask = state.fileTasks[taskId];
  if (!fileTask) {
    throw new Error(`task [${taskId}] not found`);
  }
  const filePart = fileTask.transfer.fileParts.find(e => e.blobHead === blobHead);
  if (!filePart) { return {}; }
  return {
    filePart: Object.assign({}, filePart, { blobData: undefined })
  };
}