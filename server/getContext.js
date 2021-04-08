const { getContext } = require('../kernel/server');

module.exports = async () => {
  const context = getContext();
  return context;
}
