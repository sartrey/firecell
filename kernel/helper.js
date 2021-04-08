const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
const util = require('util');

/**
 * open target by shell
 * @param {String} target 
 */
 function openByShell(target) {
  if (os.platform() === 'darwin') {
    childProcess.exec(`open ${target}`);
  }
}

module.exports = {
  makeDir: util.promisify(fs.mkdir),
  readDir: util.promisify(fs.readdir),
  readFile: util.promisify(fs.readFile),
  writeFile: util.promisify(fs.writeFile),
  statFile: util.promisify(fs.stat),
  killFile: util.promisify(fs.unlink),
  openByShell,
}