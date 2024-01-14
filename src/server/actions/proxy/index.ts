import fs from 'fs';
import { stat, readdir, readFile } from 'fs/promises';
import path from 'path';
import mime from 'mime-types';
import { ActionDeclareResult, ActionResult, Context, IncomingMessage } from '@epiijs/server';

import apiState from './state.js';

function buildResultForAPI(status: number, result?: any): ActionResult {
  const mapForStatus: Record<number, number> = { 200: 0, 404: 4, 500: 5 };
  return {
    status,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*'
    },
    content: JSON.stringify({
      status: mapForStatus[status],
      result
    })
  };
}

function tryParsePayload(body: Buffer | undefined): any {
  try {
    return JSON.parse(body?.toString() || '{}');
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export default async function Proxy(message: IncomingMessage, context: Context): Promise<ActionResult> {
  console.log(message.method, message.url, message.params);

  if (message.method === 'GET') {
    console.log('=>', message.params.any);
    const fileName = message.params.any || '';
    const filePath = path.join(apiState.workPath, fileName);
    try {
      if (!fileName) { throw new Error('file not found'); }
      const fileStat = await stat(filePath);
      const fileTooLarge = fileStat.size > 1 * 1024 * 1024;
      const fileContent = fileTooLarge ? fs.createReadStream(filePath) : await readFile(filePath);
      return {
        status: 200,
        headers: {
          ...Buffer.isBuffer(fileContent) ? { 'content-length': fileStat.size.toString() } : undefined,
          'content-type': mime.contentType(fileName) || 'application/octet-stream',
          'access-control-allow-origin': '*',
          'timing-allow-origin': '*'
        },
        content: fileContent
      };
    } catch (error) {
      console.error(error);
      return {
        status: 404,
        headers: {
          'content-type': 'text/plain; charset=utf-8'
        }
      };
    }
  }

  const appConfig = context.getAppConfig();
  const apiDir = path.join(appConfig.root, appConfig.dirs.target, appConfig.dirs.server, 'actions/proxy/apis');
  const apiFiles = await readdir(apiDir);
  const apiFile = (message.params.api || 'notFound') + '.js';
  if (!apiFiles.includes(apiFile)) {
    console.log({ apiFiles });
    return buildResultForAPI(404, `api [${apiFile.slice(-3)}] not found`);
  }

  try {
    const apiModule = await import(path.join(apiDir, apiFile));
    const apiParams = tryParsePayload(await message.body);
    console.log('=>', apiFile.slice(0, -3));
    const apiResult = await apiModule.default(apiParams, apiState, appConfig);
    return buildResultForAPI(200, apiResult);
  } catch (error: any) {
    const result = {
      error: error.message || 'unknown',
      stack: error.stack
    };
    console.error({ result });
    return buildResultForAPI(500, result);
  }
}

export function declare(): ActionDeclareResult {
  return {
    routes: [
      { method: 'GET', path: '/proxy/:any' },
      { method: 'POST', path: '/proxy/:api' }
    ]
  };
}