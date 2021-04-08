const render = require('@epiijs/render');
const server = require('./kernel/server');

const config = {
  path: {
    root: __dirname,
  },
};

const env = process.env.NODE_ENV;
if (env !== 'development') {
  render.buildOnce(config);
} else {
  render.watchBuild(config)
    .then(() => {
      server.startServer();
    });
}
