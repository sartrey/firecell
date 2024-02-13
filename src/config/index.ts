import { join as joinPath } from 'path';
import {
  getDirNameByImportMeta,
  IMaybeAppConfig
} from '@epiijs/config';

const config: IMaybeAppConfig = {
  root: joinPath(getDirNameByImportMeta(import.meta), '../../'),
  name: 'firecell',
  dirs: {
    client: 'client',
    server: 'server'
  }
};

export default config;
