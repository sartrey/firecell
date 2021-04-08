const os = require('os');
const path = require('path');
const { readDir, statFile } = require('../kernel/helper');
const { getContext } = require('../kernel/server');

module.exports = async (input) => {
  const context = getContext();

  let target = input.path || '~';
  if (target === '~') {
    target = os.homedir();
  } else if (target === '/') {
    target = '/';
  } else if (target === '..') {
    target = path.join(context.direct.path, '..');
  } else {
    target = path.join(context.direct.path, target);
  }
  context.direct.path = target;

  const files = await readDir(target);
  const fileMetas = [];
  for (let file of files) {
    const fullPath = path.join(target, file);
    const fileStat = await statFile(fullPath);
    const fileMeta = {
      path: fullPath,
      name: file,
      size: fileStat.size,
      type: 'other'
    };
    if (fileStat.isFile()) {
      fileMeta.type = 'file';
    } else if (fileStat.isDirectory()) {
      fileMeta.type = 'directory';
    }
    fileMetas.push(fileMeta);
  }
  return {
    files: fileMetas,
    cwdir: target,
  };
}
