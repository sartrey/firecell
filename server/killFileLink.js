const path = require('path');
const { writeFile, killFile, } = require('../kernel/helper');
const logger = require('../kernel/logger');
const { getContext, } = require('../kernel/server');

module.exports = async (input) => {
  const context = getContext();
  const fileRoot = path.join(context.mirror.path, 'file');
  const listFile = path.join(context.mirror.path, 'list');
  const links = context.mirror.links;
  const index = links.findIndex(e => e.path === input.path);
  if (index >= 0) {
    links.splice(index, 1);
  }
  const filePath = path.join(fileRoot, input.path);
  await killFile(filePath).catch(error => logger.halt(error));
  await writeFile(listFile, JSON.stringify(links));
}
