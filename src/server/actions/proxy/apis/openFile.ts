import os from 'os';
import { exec } from 'child_process';

import { IApiState } from '../state.js';

interface IParams {
  filePath: string;
}

interface IResult {
}

export default async function openFile(params: IParams, state: IApiState): Promise<IResult> {
  const platform = os.platform();
  const { filePath } = params;
  if (platform === 'darwin') {
    exec(`open "${filePath}"`);
  } else if (platform === 'win32') {
    exec(`start "" "${filePath}"`);
  } else {
    throw new Error(`${platform} not supported`);
  }
  return {};
}