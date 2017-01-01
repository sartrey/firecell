'use strict'

const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

module.exports = {
  notSupport,
  getJSON,
  tryParseJSON,
  bindReadOnly,
  chainPromise,
  existsPath,
  readFile,
  writeFile,
  mkdirSync,
  loadModules,
  safeExecute
}

/**
 * promise to reject as non-support
 *
 * @return {Error||Promise}
 */
function notSupport(type) {
  var error = new Error('not support')
  return !type || type === 'error' ? error : Promise.reject(error)
}

/**
 * get json message
 *
 * @param  {Assert} state
 * @param  {Object} value
 * @param  {String} label
 * @return {Object}
 */
function getJSON(state, value, label) {
  var o = { state: !!state }
  if (value != null) {
    if (label) {
      o[label] = value
    } else if (state) {
      o.model = value
    } else {
      o.error = value
    }
  }
  return o
}

/**
 * try to parse json
 * use default json if fail
 *
 * @param  {String} text
 * @param  {Object} json
 * @return {Object}
 */
function tryParseJSON(text, json) {
  try {
    var o = JSON.parse(text)
    return o
  } catch (error) {
    return json
  }
}

/**
 * bind ReadOnly property
 *
 * @param  {Object} target
 * @param  {String} name
 * @param  {*} value
 */
function bindReadOnly(target, name, value) {
  Object.defineProperty(target, name, {
    value: value,
    writable: false,
    configurable: false,
    enumerable: true
  })
}

/**
 * chain promise
 *
 * @param  {Promise[]} promises
 * @return {Promise} chain
 */
function chainPromise(promises) {
  var chain = Promise.resolve()
  promises.forEach(function (promise) {
    chain = chain.then(function (o) {
      return typeof promise === 'function' ? promise(o) : promise
    })
  })
  return chain
}

/**
 * test if path exists
 *
 * @param  {String} p
 * @return {Boolean}
 */
function existsPath(p) {
  try {
    fs.accessSync(p, fs.F_OK)
    return true
  } catch (error) {
    return false
  }
}

/**
 * make directory -r
 *
 * @param  {String} dir
 */
function mkdirSync(dir) {
  var parts = dir.split('/').filter(Boolean)
  var pFull = '/'
  for (var i = 0; i < parts.length; i ++) {
    pFull = path.join(pFull, parts[i])
    if (!existsPath(pFull)) {
      fs.mkdirSync(pFull)
    }
  }
}

/**
 * read file
 *
 * @param  {String} p
 * @param  {String} enc
 * @return {Promise}
 */
function readFile(p, enc) {
  return new Promise(function (resolve, reject) {
    fs.readFile(p, enc, function (error, data) {
      if (error) return reject(error)
      resolve(data)
    })
  })
}

/**
 * write file
 *
 * @param  {String} p
 * @param  {Buffer|String} data
 * @param  {String} enc
 * @return {Promise}
 */
function writeFile(p, data, enc) {
  return new Promsie(function (resolve, reject) {
    fs.writeFile(p, data, enc, function (error) {
      if (error) return reject(error)
      resolve()
    })
  })
}

/**
 * load modules
 *
 * @param  {String} dir
 * @param  {Function} cb - callback fn(file, module)
 */
function loadModules(dir, cb) {
  var files = fs.readdirSync(dir)
  files.forEach(function (file) {
    // need *.js
    if (!/\.js$/.test(file)) return

    try {
      var o = require(path.join(dir, file))
      if (cb) cb(file, o)
    }
    catch (error) {
      console.log('failed to load: ' + file)
      console.log(error)
    }
  })
}

/**
 * promise to execute command
 * stderr can be ignored, useful for git
 * options:
 *  {Boolean} ignore - skip stderr
 *
 * @param  {String} command
 * @param  {Object=} options
 * @return {Promise}
 */
function safeExecute(command, options) {
  return new Promise(function (resolve, reject) {
    /**
     * exec callback
     *
     * @param  {Object} error
     * @param  {Buffer} stdout
     * @param  {Buffer} stderr
     */
    function execCb (error, stdout, stderr) {
      // reject if error
      if (error) return reject(error)

      // resolve if ignore stderr
      if (options && options.ignore) return resolve(stdout)

      // resolve if null or empty stderr(Buffer)
      if (!stderr || stderr.length === 0) return resolve(stdout)

      // reject if stderr
      reject(new Error(stderr.toString()))
    }

    if (options) {
      if (options.cwd && !existsPath(options.cwd)) {
        return reject(new Error('cwd not found'))
      }
    }
    child_process.exec(command, options, execCb)
  })
}
