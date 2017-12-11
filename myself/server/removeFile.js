const fs = require('fs')
const path = require('path')
const assist = require('../../kernel/assist.js')
const config = require('../../kernel/config.js')

const sourceDir = path.join(config.path.mirror, 'static')

module.exports = function (ctx, query) {
  var fullPath = path.join(sourceDir, query.path)
  return new Promise(function (resolve, reject) {
    fs.unlink(fullPath, error => {
      if (error) reject(error)
      else resolve()
    })
  })
  .then(() => assist.getJSON(true))
  .catch(error => assist.getJSON(false, error.message))
}
