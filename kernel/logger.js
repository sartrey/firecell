'use strict'

var chalk
try {
  chalk = require('chalk')
} catch (error) {}

const LOGO = chalk ? 'firecell' : '[firecell]'
const TYPE = {
  info: 'blue',
  warn: 'yellow',
  halt: 'red',
  done: 'green'
}
const TYPE_NAMES = Object.keys(TYPE)

module.exports = {}

Object.keys(TYPE).forEach(name => {
  module.exports[name] = chalk ?
  function () {
    var head = chalk[TYPE[name]](LOGO)
    var args = Array.prototype.slice.call(arguments, 0)
    console.log.apply(null, [head].concat(args))
  } :
  function () {
    var badge = LOGO + `[${name}]`
    var args = Array.prototype.slice.call(arguments, 0)
    console.log.apply(null, [head].concat(args))
  }
})
