const assist = require('../../kernel/assist.js')

module.exports = function () {
  setTimeout(function () {
    process.exit(0)
  }, 2000)
  return assist.getJSON(true)
}
