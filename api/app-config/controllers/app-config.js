const modules = require('../modules.json');

module.exports = {
  async modules(ctx) {
    ctx.send({ modules });
  },
};
