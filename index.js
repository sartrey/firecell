'use strict'

const http = require('http')
const os = require('os')
const logger = require('./kernel/logger.js')
const createFirecell = require('./factory')

function openStart(config) {
  if (os.platform() === 'darwin') {
    const assist = require('./kernel/assist.js')
    assist.safeExecute(`open http://localhost:${config.port}`)
  }
}

/**
 * start Firecell
 *
 * @param {Object=} conf
 * @return {Object} { http.Server }
 */
function startFirecell(conf) {
  // create firecell
  var server = createFirecell(conf)
  var version = require('./package.json').version
  logger.info(`version ${version}`)
  
  // load latest config
  var config = require('./kernel/config.js')

  // http server
  // create http server for client
  var httpServer = http
    .createServer(server)
    .listen(config.port, function () {
      logger.warn(`listening at ${config.port}`)
      logger.warn(`working as ${config.mode} mode`)
      if (config.mode === 'direct') {
        logger.info(`working at ${config.path.direct}`)
      }
      openStart(config)
    })
  // httpServer.timeout = 60000
  httpServer.on('clientError', function (error, socket) {
    logger.halt('http error >', error.stack)
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
  })
  httpServer.on('timeout', function (socket) {
    socket.end()
  })
  httpServer.config = config
  return httpServer
}

module.exports = startFirecell
module.exports.factory = createFirecell
