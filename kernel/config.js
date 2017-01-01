'use strict'

const _ = require('lodash')
const assist = require('./assist')

const config = {}

// bind load method
assist.bindReadOnly(config, 'load', loadConfig)
assist.bindReadOnly(config, 'pick', pickConfig)

/**
 * load config
 *
 * @param {Object=} conf - custom config
 * @return {Object} full config
 **/
function loadConfig(conf) {
  // null, undefined, false => no merge
  if (!conf) return config
  return _.merge(config, conf)
}

/**
 * pick config by path
 * a.b.c for c in { a: { b: { c: x } } }
 *
 * @param  {String} path
 * @return {Object} pick config
 */
function pickConfig(path) {
  var paths = path.split('.')
  var conf = config
  for (var i = 0; i < paths.length; i ++) {
    if (conf == null) break
    conf = conf[paths[i]]
  }
  return conf
}

module.exports = config
