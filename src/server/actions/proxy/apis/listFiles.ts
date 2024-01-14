import os from 'os';
import path from 'path';
import { readdir, stat } from 'fs/promises';
import mime from 'mime-types';

import { IApiState } from '../state.js';
import { IFileItem } from '../types.js';

interface IParams {
  workPath: string;
}

interface IResult {
  workPath: string;
  fileItems: IFileItem[];
}

export default async function listFiles(params: IParams, state: IApiState): Promise<IResult> {
  let nextPath = state.workPath;
  if (params.workPath) {
    if (params.workPath === '~') {
      nextPath = os.homedir();
    } else if (params.workPath === '/') {
      nextPath = '/';
    } else if (params.workPath === '..') {
      nextPath = path.join(nextPath, '..');
    } else if (params.workPath === '%') {
      // TODO: create directory for mirror library in home dir 
    } else {
      // TODO: check if directory existed and use it if existed
      if (params.workPath.startsWith('/')) {
        nextPath = params.workPath;
      } else {
        nextPath = path.join(nextPath, params.workPath);
      }
    }
  }

  state.workPath = nextPath;

  const fileNames = params.workPath ? await readdir(nextPath) : [];
  const fileMetas: IFileItem[] = [];
  for (let fileName of fileNames) {
    const filePath = path.join(nextPath, fileName);
    const fileStat = await stat(filePath).catch(error => {
      console.error(error);
      return undefined;
    });
    const fileMeta: IFileItem = {
      fileName,
      filePath,
      fileSize: fileStat?.size || 0,
      itemType: 'other',
      mimeType: mime.lookup(fileName) || 'application/octet-stream'
    };
    if (fileStat) {
      if (fileStat.isFile()) {
        fileMeta.itemType = 'file';
      } else if (fileStat.isDirectory()) {
        fileMeta.itemType = 'directory';
      }
    }
    fileMetas.push(fileMeta);
  }

  return {
    workPath: nextPath,
    fileItems: fileMetas
  };
}