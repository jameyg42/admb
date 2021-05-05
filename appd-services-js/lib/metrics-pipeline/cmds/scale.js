const base = require('./_base');

module.exports = {
    compile: base.compileForValues('scale', (ctx,args) => (v) => v * args.factor),
    params: ['factor']
}