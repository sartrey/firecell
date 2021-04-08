const path = require('path');
const { makeDir, readFile, writeFile, statFile, } = require('../kernel/helper');
const { getContext, } = require('../kernel/server');
const logger = require('../kernel/logger');

const defaultLinks = [
  { path: '/react.js', from: '//cdn.bootcss.com/react/15.4.1/react.js', },
  { path: '/react-dom.js', from: '//cdn.bootcss.com/react/15.4.1/react-dom.js', },
  { path: '/jquery.js', from: '//cdn.bootcss.com/jquery/3.1.1/jquery.js', },
];

async function loadLinkList(listFile) {
  let links = null;
  try {
    links = JSON.parse(await readFile(listFile));
  } catch (error1) {
    links = defaultLinks;
    await writeFile(listFile, JSON.stringify(defaultLinks))
      .catch(error2 => logger.halt(error2));
  }
  return links;
}

module.exports = async (input) => {
  const context = getContext();
  const fileRoot = path.join(context.mirror.path, 'file');
  const listFile = path.join(context.mirror.path, 'list');

  await makeDir(fileRoot, { recursive: true });

  const links = context.mirror.links.length > 0
    ? context.mirror.links
    : await loadLinkList(listFile);
  const inputLinkPaths = input.links || [];
  context.mirror.links = links;

  let result = [];
  for (let item of links) {
    if (inputLinkPaths.length > 0 && inputLinkPaths.indexOf(item.path) < 0) continue;
    const filePath = path.join(fileRoot, item.path);
    const fileStat = await statFile(filePath).catch(error => logger.halt(error));
    const fileMeta = {
      path: item.path,
      from: item.from,
      full: filePath,
      size: fileStat ? fileStat.size : -1,
    }
    result.push(fileMeta);
  }
  return result;
}
