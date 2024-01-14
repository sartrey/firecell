import { createContext } from 'react';

import { IHostInfo } from '../types';

const AppContext = createContext<{
  hostInfo?: IHostInfo;
  workPath?: string;
}>({});

export default AppContext;

export { useHostInfo } from './useHostInfo';
export { useWorkPath } from './useWorkPath';