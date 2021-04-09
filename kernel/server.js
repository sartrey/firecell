const os = require('os');
const http = require('http');
const path = require('path');
const epiiMinion = require('@epiijs/minion');
const { makeDir, writeFile, openByShell, } = require('./helper');
const logger = require('./logger.js');
const packageJSON = require('../package.json');

const homedir = os.homedir();
const maindir = path.join(homedir, '.firecell');

const CONTEXT = {
  mode: 'mirror',
  ipv4: [],
  port: 9999,

  mirror: {
    path: maindir,
    links: [],
  },

  direct: {
    path: homedir,
  },
};

/**
 * get firecell context
 * @returns {Object}
 */
function getContext() {
  return CONTEXT;
}

function getIPv4List() {
  var os = require('os')
  var networks = os.networkInterfaces()
  var ipv4List = []
  Object.keys(networks).forEach(name => {
    var network = networks[name]
    network.filter(item => item.family === 'IPv4' && !item.internal)
    .forEach(item => ipv4List.push(item.address))
  })
  return ipv4List
}

/**
 * apply config
 *
 * @param  {Object} config
 */
function applyConfig(config = {}) {
  if (config.mode) CONTEXT.mode = config.mode;
  if (config.port) CONTEXT.port = config.port;
  if (config.path) {
    CONTEXT[config.mode].path = config.path
      .replace(/^~/, homedir);
  }
}

/**
 * create firecell
 * @return {Function} standard http.Server callback
 */
async function createServer() {
  // write port file
  await makeDir(maindir, { recursive: true });
  // create minion server
  const minion = {
    path: {
      root: path.join(__dirname, '../'),
      layout: 'kernel/layout.html',
    },
  };
  return epiiMinion.createServer(minion);
}

/**
 * start firecell
 *
 * @param {Object=} conf
 * @return {Object} { http.Server }
 */
async function startServer(config) {
  process.on('unhandledRejection', (error) => {
    logger.halt(error);
  });

  // apply config
  applyConfig(config);

  // load host info
  CONTEXT.ipv4 = getIPv4List();

  // create firecell
  const server = await createServer();
  
  // create http server for client
  await writeFile(path.join(maindir, 'port'), CONTEXT.port.toString())
  const httpServer = http
    .createServer(server)
    .listen(CONTEXT.port, () => {
      logger.info(`version ${packageJSON.version}`);
      logger.warn(`listening at ${CONTEXT.port}`);
      logger.warn(`working as ${CONTEXT.mode} mode`);
      if (CONTEXT.mode === 'direct') {
        logger.info(`working at ${CONTEXT.direct.path}`);
      }
      openByShell(`http://localhost:${CONTEXT.port}`);
    })  
    .on('clientError', (error, socket) => {
      if (error.code === 'ECONNRESET' || !socket.writable) return;
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    })
    .on('timeout', (socket) => {
      socket.end()
    });
  return httpServer
}

module.exports = {
  startServer,
  getContext,
};
