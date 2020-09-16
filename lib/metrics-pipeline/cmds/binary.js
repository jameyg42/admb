const base = require('./_base');

module.exports = {
    compile: base.compileForValues('abs', (ctx, args) => (v) => v > 0 ? 1 : 0),
    params: []
}
