const fs = require('fs')
const path = require('path');
const fetch = require('node-fetch');
const { getContext, } = require('../kernel/server');

module.exports = async (input) => {
  const context = getContext();
  const fileRoot = path.join(context.mirror.path, 'file');
  const filePath = path.join(fileRoot, input.path);

  let fileURL = input.from;
  if (fileURL.startsWith('//')) {
    fileURL = `https:${fileURL}`;
  }
  return fetch(fileURL)
    .then((response) => new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(filePath);
      response.body.pipe(stream);
      stream.on('close', resolve);
      stream.on('error', reject);
    }));
}
