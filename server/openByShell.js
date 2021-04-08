const path = require('path');
const { openByShell, } = require('../kernel/helper');
const { getContext, } = require('../kernel/server');

module.exports = async function (input) {
  const context = getContext();
  if (context.mode === 'direct') {
    openByShell(input.path);
    return;
  }
  if (context.mode === 'mirror') {
    openByShell(path.join(context.mirror.path, 'file', input.path));
    return;
  }
}
