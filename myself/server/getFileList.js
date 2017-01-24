const fs = require('fs')
const os = require('os')
const path = require('path')

const assist = require('../../kernel/assist.js')
const config = require('../../kernel/config.js')

module.exports = function (ctx, query) {
  ctx.async = true

  if (config.mode === 'mirror') {
    return getMirrorFileList()
  }

  if (config.mode === 'direct') {
    return getDirectFileList(query.path)
  }

  return assist.getJSON(false)
}

function getMirrorFileList() {
  var dataPath = path.join(os.homedir(), '.firecell/.list')
  var dataJSON
  if (assist.existsPath(dataPath)) {
    dataJSON = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  } else {
    dataJSON = [
      { path: '/react.js', link: '//cdn.bootcss.com/react/15.4.1/react.js' },
      { path: '/react-dom.js', link: '//cdn.bootcss.com/react/15.4.1/react-dom.js' },
      { path: '/jquery.js', link: '//cdn.bootcss.com/jquery/3.1.1/jquery.js' }
    ]
    fs.writeFileSync(dataPath, JSON.stringify(dataJSON, null, 2))
  }
  return assist.getJSON(true, dataJSON)
}

function getDirectFileList(dir) {
  if (dir === '~') {
    dir = os.homedir()
  }
  else if (dir !== '/') {
    dir = path.join(config.path.cursor, dir || '')
  }
  config.path.cursor = dir

  var files = fs.readdirSync(dir)
  .map(file => {
    var fullPath = path.join(dir, file)
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
  return assist.getJSON(true, files)
}
