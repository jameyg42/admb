const base = require('./_base');

module.exports = {
    compile: base.compileForValues('log', (ctx, args) => Math.log),
    params: []
}
