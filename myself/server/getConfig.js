const os = require('os')

const assist = require('../../kernel/assist.js')
const config = require('../../kernel/config.js')

module.exports = function (ctx, query) {
  if (!config.host) config.host = {}
  var networks = os.networkInterfaces()
  var ipv4List = []
  Object.keys(networks).forEach(name => {
    var network = networks[name]
    network.filter(item => item.family === 'IPv4' && !item.internal)
    .forEach(item => ipv4List.push(item.address))
  })
  config.host.ipv4 = ipv4List
  return assist.getJSON(true, config)
}
