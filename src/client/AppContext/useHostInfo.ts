import { useEffect, useState } from 'react';

import { fetchApi } from '../fetcher';
import { IHostInfo } from '../types';

export function useHostInfo() {
  const [stateHostInfo, setStateHostInfo] = useState<IHostInfo>();

  const fetchHostInfo = async () => {
    const result = await fetchApi<IHostInfo>('testHost');
    setStateHostInfo(result);
  };

  useEffect(() => {
    fetchHostInfo();
  }, []);

  return {
    stateHostInfo
  };
}