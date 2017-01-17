const assist = require('../../kernel/assist.js')

module.exports = function (ctx, query) {
  return assist.getJSON(false)
}
