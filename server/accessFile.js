const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { getContext, } = require('../kernel/server');

module.exports = async (input, request) => {
  const rawURL = new URL(request.url, 'http://dummyhost');
  const rawPath = rawURL.searchParams.get('path');

  const context = getContext();
  let filePath = null;
  if (context.mode === 'direct') {
    filePath = rawPath;
  }
  if (context.mode === 'mirror') {
    const fileRoot = path.join(context.mirror.path, 'file');
    filePath = path.join(fileRoot, rawPath);
  }

  return fs.createReadStream(filePath);
}
