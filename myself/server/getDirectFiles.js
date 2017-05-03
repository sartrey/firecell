const fs = require('fs')
const os = require('os')
const path = require('path')

const assist = require('../../kernel/assist.js')
const config = require('../../kernel/config.js')

module.exports = function (ctx, query) {
  var target = query.path || ''
  if (target === '~') target = os.homedir()
  else if (target === '/') target = '/'
  else if (target === '..') target = path.join(config.path.cursor, '..')
  else target = path.join(config.path.cursor, target)
  config.path.cursor = target

  var files = fs.readdirSync(target)
  .map(file => {
    var fullPath = path.join(target, file)
    var stats = fs.statSync(fullPath)
    var fileMeta = {
      path: fullPath,
      name: file,
      size: stats.size
    }
    if (stats.isFile()) {
      fileMeta.type = 'file'
    } else if (stats.isDirectory()) {
      fileMeta.type = 'directory'
    } else {
      fileMeta.type = 'other'
    }
    return fileMeta
  })
  var result = assist.getJSON(true, files)
  result.cwdir = target
  return result
}
