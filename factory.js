'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const assist = require('./kernel/assist.js')
const config = require('./kernel/config.js')
const logger = require('./kernel/logger.js')
const server = require('./kernel/server.js')

const homedir = os.homedir()
const maindir = path.join(homedir, '.firecell')

/**
 * create firecell
 *
 * @param  {Object=} conf
 * @return {Function} standard http.Server callback
 */
function createFirecell(conf) {
  // load cascaded config, default + custom
  config.load({
    mode: 'mirror',
    path: {
      mirror: path.join(homedir, '.firecell'),
      direct: homedir,
      cursor: homedir
    },
    port: 9999
  })
  config.load(conf || {})

  // write port file
  assist.mkdirSync(maindir)
  fs.writeFileSync(path.join(maindir, 'port'), config.port.toString())

  return require('./handler.js')
}

module.exports = createFirecell
