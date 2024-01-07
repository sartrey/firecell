// runner.js is only for dev and local build
// you should write your own script for the cloud infra

async function main() {
  const action = process.argv[2];

  const {
    default: appConfig
  } = await import('../build/config/index.js');

  switch (action) {
    case 'start-server': {
      const { startServer } = await import('@epiijs/server');
      const { httpServer } = await startServer(appConfig);
      process.on('SIGINT', () => {
        httpServer.closeAllConnections();
        httpServer.close();
      });
      break;
    }
    case 'build-server': {
      // TODO: WIP
      break;
    }
    case 'start-client': {
      const { startClient } = await import('@epiijs/client');
      startClient(appConfig);
      break;
    }
    case 'build-client': {
      const { buildClient } = await import('@epiijs/client');
      buildClient(appConfig);
      break;
    }
  }
}

main();