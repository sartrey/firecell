const path = require('path')
const epiiRender = require('epii-render')

const config = {
  client: path.join(__dirname, 'client'),
  vendor: path.join(__dirname, 'vendor'),
  static: path.join(__dirname, 'static'),
  filter: 'component', // skip client/**/component/*
  holder: {
    name: 'app', // container name, name='app' > div#app
    stub: 'epii' // variable stub, stub='epii' > window.epii.view = React view
  },
  logger: true
}

var env = process.env.NODE_ENV
if (env === 'development') {
  epiiRender.watch(config)
  require('../')()
} else {
  epiiRender.build(config)
}
