const { getContext, } = require('../kernel/server');

module.exports = async (input) => {
  const context = getContext();
  if (context.mode === 'mirror') {
    context.mode = 'direct';
  } else {
    context.mode = 'mirror';
  }
}
