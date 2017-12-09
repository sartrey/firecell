const fs = require('fs')
const path = require('path')
const assist = require('../../kernel/assist.js')
const config = require('../../kernel/config.js')

const sourceDir = path.join(config.path.mirror, 'static')
const listPath = path.join(config.path.mirror, 'list')
const defaultList = [
  { path: '/react.js', link: '//cdn.bootcss.com/react/15.4.1/react.js' },
  { path: '/react-dom.js', link: '//cdn.bootcss.com/react/15.4.1/react-dom.js' },
  { path: '/jquery.js', link: '//cdn.bootcss.com/jquery/3.1.1/jquery.js' }
]

module.exports = function (ctx, query) {
  assist.mkdirSync(sourceDir)

  var files
  if (assist.existSync(listPath)) {
    files = assist.tryParseJSON(fs.readFileSync(listPath, 'utf8'), [])
  } else {
    files = defaultList
    fs.writeFileSync(listPath, JSON.stringify(defaultList, null, 2))
  }

  var queryFiles = query.list ? query.list.split(',').filter(Boolean) : []
  if (queryFiles.length > 0) {
    files = files.filter(file => queryFiles.indexOf(file.path) >= 0)
  }
  files = files.map(file => {
    var fullPath = path.join(sourceDir, file.path)

    try {
      var stats = fs.statSync(fullPath)
    } catch (error) {
      // logger warn
    }
    var fileMeta = {
      path: file.path,
      link: file.link,
      real: fullPath,
      size: stats ? stats.size : 0
    }
    if (stats && stats.isFile()) {
      fileMeta.type = 'file'
    } else {
      fileMeta.type = 'null'
    }
    return fileMeta
  })

  return assist.getJSON(true, files)
}
