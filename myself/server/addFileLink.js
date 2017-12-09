const fs = require('fs')
const path = require('path')
const assist = require('../../kernel/assist.js')
const config = require('../../kernel/config.js')

const sourceDir = path.join(config.path.mirror, 'static')
const defaultList = [
  { path: '/react.js', link: '//cdn.bootcss.com/react/15.4.1/react.js' },
  { path: '/react-dom.js', link: '//cdn.bootcss.com/react/15.4.1/react-dom.js' },
  { path: '/jquery.js', link: '//cdn.bootcss.com/jquery/3.1.1/jquery.js' }
]

module.exports = function (ctx, query) {
  var listPath = path.join(sourceDir, '.firecell/list')
  var files
  if (assist.existSync(listPath)) {
    files = assist.tryParseJSON(fs.readFileSync(listPath, 'utf8'), [])
    files.push({ path: query.path, link: query.link })
  } else {
    files = defaultList
  }
  fs.writeFileSync(listPath, JSON.stringify(files, null, 2))
  return assist.getJSON(true, files)
}
