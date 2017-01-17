'use strict'

const config = require('./kernel/config.js')
const logger = require('./kernel/logger.js')
const server = require('./kernel/server.js')

const HOMEDIR = require('os').homedir()

/**
 * create firecell
 *
 * @param  {Object=} conf
 * @return {Function} standard http.Server callback
 */
function createFirecell(conf) {
  const path = require('path')

  // load cascaded config, default + custom
  config.load({
    mode: 'mirror',
    path: {
      mirror: path.join(HOMEDIR, '.firecell'),
      direct: HOMEDIR
    },
    port: 9999
  })
  config.load(conf || {})

  return require('./handler.js')
}

module.exports = createFirecell
