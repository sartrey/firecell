'use strict'

const fs = require('fs')
const path = require('path')

const assist = require('./assist.js')
const logger = require('./logger.js')
const mimes = require('./_mimes.json')

const ENTRY_HTML = fs.readFileSync(
  path.join(__dirname, '../myself/entry.html'), 'utf8'
)

module.exports = {
  serveData,
  serveFile,
  serveView,
  getFileMIME
}

function serveData(exec, query) {
  var ctx = this
  var headers = {}
  headers['Content-Type'] = 'application/json'
  ctx.response.writeHead(200, headers)
  try {
    var action = require('../myself/server' + exec)
    var result = action.call(null, ctx, query)
    if (result instanceof Promise) {
      ctx.response.async = true
      result.then(json => {
        ctx.response.write(JSON.stringify(json))
        ctx.response.end()
      })
    } else {
      ctx.response.write(JSON.stringify(result))
      ctx.response.end()
    }
  }
  catch (error) {
    ctx.response.write(JSON.stringify({ state: false, error: error.message }))
    ctx.response.end()
  }
}

/**
 * serve file
 *
 * @param  {String} file
 */
function serveFile(file) {
  var ctx = this
  ctx.response.async = true

  try {
    var stat = fs.statSync(file)
  } catch (error) {
    ctx.response.writeHead(404)
    return ctx.response.end('not found')
  }

  var headers = {
    'Content-Type': getFileMIME(file),
    'Content-Length': stat.size,
    'Access-Control-Allow-Origin': '*',
    'Connection': 'close'
  }
  ctx.response.writeHead(200, headers)

  var stream = fs.createReadStream(file)
  stream.pipe(ctx.response)
  .on('error', function (error) {
    logger.halt(error.message)
    ctx.response.end()
  })
}

/**
 * serve view
 *
 * @param  {String} view
 */
function serveView(view) {
  var ctx = this
  var viewDir = path.join(__dirname, '../myself/client', view)
  if (assist.existSync(viewDir)) {
    var headers = {}
    headers['Content-Type'] = 'text/html'
    ctx.response.writeHead(200, headers)
    ctx.response.write(
      ENTRY_HTML.replace(/\$\{key\}/g, path.join(view, 'index'))
    )
    ctx.response.end()
  }
}

/**
 * get MIME by file name
 *
 * @param  {String} file - file name
 * @return {String} MIME
 */
function getFileMIME(file) {
  if (!file) return 'text/plain'
  var ext = path.extname(file)
  if (ext) ext = ext.toLowerCase().substring(1)
  return mimes[ext] || mimes.txt
}
