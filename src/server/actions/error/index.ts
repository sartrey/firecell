import { ActionResult, IncomingMessage } from '@epiijs/server';

export default async function PageError(message: IncomingMessage): Promise<ActionResult> {
  let content = 'i am fine thank you';

  const error = message.params?.error as any;
  if (error) {
    if (typeof error === 'string') {
      content = error;
    } else {
      content = Object.keys(error).concat(['message', 'stack']).map(key => {
        const value = error[key]?.replace?.(/\n/g, '<br />');
        if (value) { return `${key} = ${value}`; }
      }).filter(Boolean).join('<br />');
    }
  }

  return {
    status: (message.params?.status || 200) as number,
    headers: {
      'content-type': 'text/html; charset=utf8'
    },
    content: `<code>${content}</code>`
  };  
}

export function declare() {
  return {
    global: true
  };
}