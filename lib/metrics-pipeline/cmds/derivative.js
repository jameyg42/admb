const base = require('./_base');
module.exports = {
    compile: base.compileForValues('derivative', (ctx, args) => (v, i, a) => (i == 0 ? 0 : v - a[i-1].value)),
    params: []
}