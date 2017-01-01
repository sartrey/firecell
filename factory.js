'use strict'

const config = require('./kernel/config.js')
const server = require('./kernel/server.js')

/**
 * create firecell
 *
 * @param  {Object=} conf
 * @return {Function} standard http.Server callback
 */
function createFirecell(conf) {
  const path = require('path')

  // load cascaded config, default + custom
  config.load({
    path: path.join(require('os').homedir(), '.firecell'),
    port: 9999
  })
  config.load(conf || {})

  // load admin server apis
  server.loadAPIs(path.join(__dirname, 'myself/server'))

  return function (request, response) {
    console.log('url', request.url)
    var url = require('url').parse(request.url, true)
    var file = ''
    if (/^\/__\//.test(url.pathname)) {
      url.pathname = url.pathname.replace(/^\/__/, '')
      if (url.pathname.startsWith('/api')) {
        var route = url.pathname.replace(/^\/api/, '')
        server.routeToAPI(route)(query, response)
      }
      else {
        file = path.join(__dirname, 'myself/static', url.pathname)
        server.serveFile(file, response)
      }
    }
    else {
      if (url.pathname === '/') {
        response.writeHead(200)
        response.write(`Firecell ${require('./package.json').version}\r\n`)
        return response.end()
      }
      file = path.join(config.path, url.pathname)
      server.serveFile(file, response)
    }
    if (response.headerSent || response.async) return
    if (response.finished) return
    response.writeHead(404)
    response.end('not found')
  }
}

module.exports = createFirecell
