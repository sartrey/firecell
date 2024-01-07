import path from 'path';
import { ActionResult, Context, IncomingMessage, handlers } from '@epiijs/server';

export default async function PageHome(message: IncomingMessage, context: Context): Promise<ActionResult> {
  const { url } = message;
  console.log({ url });

  // this is a demo for local dev redirecting 
  // you should not care about dev in real service
  const isDev = process.env['epiijs_env'] === 'dev';
  const appConfig = context.getAppConfig();
  if (isDev) {
    return {
      status: 302,
      headers: {
        'location': `http://localhost:${appConfig.port.client}/`,
        'content-type': 'text/html; charset=utf8'
      }
    };
  }

  await context.useHandler(handlers.staticFiles({
    fileName: 'index.html',
    fileRoot: path.join(appConfig.root, appConfig.dirs.target, appConfig.dirs.client)
  }));
}