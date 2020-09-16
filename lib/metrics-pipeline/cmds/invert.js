const base = require('./_base');

module.exports = {
    compile: base.compileForValues('invert', (ctx, args) => (v) => v == 0 ? 0 : 1/v),
    params: []
}
