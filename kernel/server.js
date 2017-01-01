'use strict'

const fs = require('fs')

module.exports = {
  loadAPIs,
  routeToAPI,
  serveFile
}

function loadAPIs() {

}

function routeToAPI() {

}

function serveFile(file, response) {
  response.async = true
  fs.readFile(file, function (error, body) {
    if (error) {
      console.log(error)
      response.writeHead(404)
      return response.end('not found')
    }
    response.writeHead(200)
    response.write(body)
    response.end()
  })
}
