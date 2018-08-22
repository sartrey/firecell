'use strict'

const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const assist = require('./assist.js')
const logger = require('./logger.js')

const ENTRY_HTML = fs.readFileSync(
  path.join(__dirname, '../myself/entry.html'), 'utf8'
)

module.exports = {
  serveData,
  serveFile,
  serveView
}

/**
 * serve data
 *
 * @param {Object} context
 * @param {String} route
 * @param {Object} query
 */
function serveData(context, route, query) {
  var headers = {}
  headers['Content-Type'] = 'application/json'
  context.response.writeHead(200, headers)
  try {
    var action = require('../myself/server' + route)
    var result = action.call(null, context, query)
    if (result instanceof Promise) {
      context.response.async = true
      result.then(json => {
        context.response.write(JSON.stringify(json))
        context.response.end()
      })
    } else {
      context.response.write(JSON.stringify(result))
      context.response.end()
    }
  } catch (error) {
    context.response.write(JSON.stringify(assist.getJSON(false, error.message)))
    context.response.end()
  }
}

/**
 * serve file
 *
 * @param {Object} context
 * @param {String} file
 */
function serveFile(context, file) {
  context.response.async = true

  try {
    var stat = fs.statSync(file)
  } catch (error) {
    context.response.writeHead(404)
    return context.response.end('not found')
  }

  var headers = {
    'Connection': 'close',
    'Content-Type': mime.contentType(path.extname(file)) || 'application/octet-stream',
    'Content-Length': stat.size,
    'Access-Control-Allow-Origin': '*',
    'Timing-Allow-Origin': '*'
  }
  if (context.debug) {
    headers['Set-Cookie'] = `firecell=${Date.now()}`
  }
  context.response.writeHead(200, headers)
  if (context.debug) {
    logger.info('=> request')
    Object.keys(context.request.headers).forEach(key => {
      logger.warn(`=> [${key}]`, context.request.headers[key])
    })
    logger.info('<= response')
    Object.keys(headers).forEach(key => {
      logger.warn(`<= [${key.toLowerCase()}]`, headers[key])
    })
  }

  var stream = fs.createReadStream(file)
  stream.pipe(context.response)
  .on('error', function (error) {
    logger.halt(error.message)
    context.response.end()
  })
}

/**
 * serve view
 *
 * @param {Object} context
 * @param {String} view
 */
function serveView(context, view) {
  var viewDir = path.join(__dirname, '../myself/client', view)
  var headers = {
    'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Timing-Allow-Origin': '*'
  }
  context.response.writeHead(200, headers)
  context.response.write(
    ENTRY_HTML.replace(/\/\$\{key\}/g, path.join(view, 'index'))
  )
  context.response.end()
}