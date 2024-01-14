interface IOptions {
  maxRetriedTimes?: number;
}

export async function fetchApi<T = unknown>(api: string, payload?: any, options?: IOptions): Promise<T> {
  const apiPath = `/proxy/${api}`;
  let retriedTimes = 0;
  let response: any = undefined;
  while (true) {
    let fetchTask: Promise<Response>;
    // TODO: check dev by window.flag instead of host
    if (window.location.host === 'localhost:3000') {
      fetchTask = fetch(`http://localhost:3001${apiPath}`, {
        method: 'POST',
        body: JSON.stringify(payload || {}),
        mode: 'cors'
      });
    } else {
      fetchTask = fetch(apiPath, {
        method: 'POST',
        body: JSON.stringify(payload || {})
      });
    }
    response = await fetchTask
      .then(response => response.json())
      .catch(error => {
        console.error('error occurred in fetchApi', error);
        return {
          status: error.code || -1,
          result: error.message
        };
      });
    if (response.status === -1) {
      if ((retriedTimes += 1) <= (options?.maxRetriedTimes || 5)) { continue; }
    }
    if (response.status === 0) {
      return response.result as T;
    }
    const error = new Error() as any;
    error.status = response.status;
    error.result = response.result;
    throw error;
  }
}