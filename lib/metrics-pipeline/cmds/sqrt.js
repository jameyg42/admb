const base = require('./_base');

module.exports = {
    compile: base.compileForValues('sqrt', (ctx, args) => Math.sqrt),
    params: []
}
