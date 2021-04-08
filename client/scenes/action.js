import 'whatwg-fetch';

export function requestAction(action, payload) {
  return fetch(`/__data/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(response => response.json())
    .then((result) => {
      if (result.error) {
        console.error(result.error);
      }
      return result;
    })
    .catch((error) => {
      console.error(error);
      return { error: 'network error' };
    });
}