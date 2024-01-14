import { useEffect, useState } from 'react';

import { fetchApi } from '../fetcher';
import { IResultForListFiles } from '../types';

export function useWorkPath() {
  const [stateWorkPath, setStateWorkPath] = useState<string>('~');

  const fetchWorkPath = async () => {
    const result = await fetchApi<IResultForListFiles>('listFiles');
    setStateWorkPath(result.workPath);
  };

  useEffect(() => {
    fetchWorkPath();
  }, []);

  return {
    stateWorkPath,
    setStateWorkPath
  };
}