const base = require('./_base');

module.exports = {
    compile: base.compileForValues('abs', (ctx, args) => Math.abs),
    params: []
}