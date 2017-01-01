'use strict'

const http = require('http')

const createFirecell = require('./factory')

/**
 * start Firecell
 *
 * @param {Object=} conf
 * @return {Object} { http.Server }
 */
function startFirecell(conf) {
  // create firecell
  var server = createFirecell(conf)

  // load latest config
  var config = require('./kernel/config.js')

  // http server
  // create http server for client
  var httpServer = http
    .createServer(server)
    .listen(config.port)
  // httpServer.timeout = 60000
  httpServer.on('clientError', function (error, socket) {
    console.log('http error >', error.stack)
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
  })
  httpServer.on('timeout', function (error) {
    console.log(error.stack)
  })
  httpServer.config = config
  return httpServer
}

module.exports = startFirecell
module.exports.factory = createFirecell
