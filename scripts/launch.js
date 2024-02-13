#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { getDirNameByImportMeta } from '@epiijs/config';

async function main() {
  const args = process.argv.slice(2).reduce((result, e) => {
    const [, key, value] = e.match(/^--?([^=]+)(?:=(.*))?$/);
    result[key] = value;
    return result;
  }, {});
  const action = 'play' in args ? 'play' : 'help';

  switch (action) {
    case 'play': {
      const {
        default: appConfig
      } = await import('../build/config/index.js');
      const argsPort = isNaN(args.port) ? 9999 : Number(args.port);
      appConfig.port = { server: argsPort };
      const { startServer } = await import('@epiijs/server');
      const { httpServer } = await startServer(appConfig);
      process.on('SIGINT', () => {
        httpServer.closeAllConnections();
        httpServer.close();
      });
      break;
    }
    default: {
      const dirName = getDirNameByImportMeta(import.meta);
      const helpText = await fs.readFile(path.join(dirName, './help.txt'), 'utf-8');
      console.log(helpText);
      break;
    }
  }
}

main();