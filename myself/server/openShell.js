const child_process = require('child_process')

const assist = require('../../kernel/assist.js')

module.exports = function (ctx, query) {
  var command = 'open ' + query.path
  child_process.exec(command)
  return assist.getJSON(true)
}
