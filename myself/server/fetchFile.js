'use strict'

const fs = require('fs')
const path = require('path')
const request = require('request')
const assist = require('../../kernel/assist.js')
const config = require('../../kernel/config.js')

const sourceDir = path.join(config.path.mirror, 'static')

module.exports = function (ctx, query) {
  var itemDir = path.dirname(query.path)
  assist.mkdirSync(itemDir)
  var fullPath = path.join(sourceDir, query.path)

  var itemLink = query.link
  if (/^\/\//.test(itemLink)) {
    itemLink = 'https:' + itemLink
  }

  return new Promise(function (resolve, reject) {
    request.get(itemLink)
    .on('error', function(error) {
      console.error(error)
      reject(new Error('not found'))
    })
    .pipe(fs.createWriteStream(fullPath))
    .on('finish', function () {
      resolve()
    })
  })
  .then(() => assist.getJSON(true))
  .catch(error => assist.getJSON(false, error.message))
}
