const path = require('path');
const { writeFile, } = require('../kernel/helper');
const { getContext, } = require('../kernel/server');

module.exports = async (input) => {
  const context = getContext();
  const listFile = path.join(context.mirror.path, 'list');
  const links = context.mirror.links;
  if (input.path && input.from) {
    const link = links.find(e => e.path === input.path);
    if (link) {
      link.from = input.from;
    } else {
      links.push({
        path: input.path,
        from: input.from,
      });
    }
    await writeFile(listFile, JSON.stringify(links));
  }
}
