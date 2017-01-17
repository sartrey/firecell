const fs = require('fs')
const os = require('os')
const path = require('path')

const assist = require('../../kernel/assist.js')

module.exports = function (ctx, query) {
  ctx.async = true
  var dataPath = path.join(os.homedir(), '.firecell/.list')
  var dataJSON
  if (assist.existsPath(dataPath)) {
    dataJSON = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    dataJSON.push({ path: query.path, link: query.link })
  } else {
    dataJSON = [
      { path: '/react.js', link: '//cdn.bootcss.com/react/15.4.1/react.js' },
      { path: '/react-dom.js', link: '//cdn.bootcss.com/react/15.4.1/react-dom.js' },
      { path: '/jquery.js', link: '//cdn.bootcss.com/jquery/3.1.1/jquery.js' }
    ]
  }
  fs.writeFileSync(dataPath, JSON.stringify(dataJSON, null, 2))
  return assist.getJSON(true, dataJSON)
}
