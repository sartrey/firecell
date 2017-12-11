const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const assist = require('../../kernel/assist.js')
const config = require('../../kernel/config.js')

const sourceDir = path.join(config.path.mirror, 'static')

module.exports = function (ctx, query) {
  assist.mkdirSync(path.dirname(query.path))
  var fullPath = path.join(sourceDir, query.path)

  var itemLink = query.link
  if (/^\/\//.test(itemLink)) {
    itemLink = 'https:' + itemLink
  }

  return fetch(itemLink).then(function (response) {
    var ws = fs.createWriteStream(fullPath)
    response.body.pipe(ws)
    return assist.getJSON(true)
  })
  .catch(function (error) {
    console.error(error)
    return assist.getJSON(false, error.message)
  })
}
