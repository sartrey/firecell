import os, { NetworkInterfaceInfo } from 'os';
import { IAppConfig } from '@epiijs/config';

import { IApiState } from '../state.js';
import { IHostInfo } from '../types.js';

export default async function testHost(params: any, state: IApiState, config: IAppConfig): Promise<IHostInfo> {
  const networkInterfaces = ([] as NetworkInterfaceInfo[])
    .concat(...(Object.values(os.networkInterfaces()) as NetworkInterfaceInfo[][]));
  const networkInterface = networkInterfaces.find(v => v.family === 'IPv4' && v.internal === false);
  const hostIPv4 = networkInterface ? networkInterface.address : '';
  const hostPort = config.port.server;

  return {
    hostIPv4: hostIPv4,
    hostPort: hostPort
  };
}
