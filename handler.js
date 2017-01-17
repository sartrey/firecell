'use strict'

const path = require('path')

const config = require('./kernel/config.js')
const logger = require('./kernel/logger.js')
const server = require('./kernel/server.js')

const REGEXP_ADMIN = /^\/__/
const REGEXP_ENTRY = /^\/[^\.]*(.html)?$/

module.exports = function (request, response) {
  logger.info('=>', request.url)
  var ctx = { request, response }

  var url = require('url').parse(request.url, true)

  if (REGEXP_ADMIN.test(url.pathname)) {
    // remove admin prefix
    url.pathname = url.pathname.replace(REGEXP_ADMIN, '')

    if (/^\/api/.test(url.pathname)) {
      server.serveData.call(
        ctx, url.pathname.replace(/^\/api/, ''), url.query
      )
    }
    else if (REGEXP_ENTRY.test(url.pathname)) {
      server.serveView.call(ctx, path.join('/admin', config.mode))
    }
    else {
      server.serveFile.call(
        ctx, path.join(__dirname, 'myself/static', url.pathname)
      )
    }
  }
  else if (REGEXP_ENTRY.test(url.pathname)) {
    server.serveView.call(ctx, '/start')
  }
  else {
    server.serveFile.call(
      ctx, path.join(config.path[config.mode], url.pathname)
    )
  }

  // default response
  if (response.headerSent || response.async) return
  if (response.finished) return
  response.writeHead(404)
  response.end('not found')
}
