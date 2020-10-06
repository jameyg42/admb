const base = require('./_base');

module.exports = {
    compile: base.compileForValues('e', (ctx, args) => Math.exp),
    params: []
}
