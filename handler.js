'use strict'

const path = require('path')
const config = require('./kernel/config.js')
const logger = require('./kernel/logger.js')
const server = require('./kernel/server.js')

const REGEXP_ADMIN = /^\/__/
const REGEXP_ENTRY = /^\/$/

module.exports = function (request, response) {
  var ctx = { request, response }
  var url = require('url').parse(request.url, true)
  if (url.query.debug) {
    Object.keys(request.headers).forEach(key => {
      logger.warn(`[${key}]`, request.headers[key])
    })
  }

  if (REGEXP_ADMIN.test(url.pathname)) {
    // output debug url info
    if (process.env.NODE_ENV === 'development') {
      logger.done('=>', request.url)
    }

    // remove admin prefix
    url.pathname = url.pathname.replace(REGEXP_ADMIN, '')

    if (/^\/api/.test(url.pathname)) {
      server.serveData(ctx, url.pathname.replace(/^\/api/, ''), url.query)
    }
    else if (REGEXP_ENTRY.test(url.pathname)) {
      server.serveView(ctx, path.join('/admin', config.mode))
    }
    else {
      server.serveFile(ctx, path.join(__dirname, 'myself/static', url.pathname))
    }
  }
  else if (REGEXP_ENTRY.test(url.pathname)) {
    server.serveView(ctx, '/start')
  }
  else {
    logger.done('=>', request.url)
    if (config.mode === 'mirror') {
      server.serveFile(ctx, path.join(config.path.mirror, 'static', url.pathname))
    }
    else if (config.mode === 'direct') {
      server.serveFile(ctx, path.join(config.path.cursor, decodeURI(url.pathname)))
    }
  }

  // default response
  if (response.headerSent || response.async) return
  if (response.finished) return
  response.writeHead(404)
  response.end('not found')
}
