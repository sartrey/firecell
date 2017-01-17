const assist = require('../../kernel/assist.js')
const config = require('../../kernel/config.js')

module.exports = function (ctx, query) {
  if (config.mode === 'mirror') {
    config.mode = 'direct'
  } else {
    config.mode = 'mirror'
  }
  return assist.getJSON(true)
}
