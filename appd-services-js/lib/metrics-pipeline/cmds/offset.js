const base = require('./_base');

module.exports = {
    compile: base.compileForValues('offset', (ctx,args) => (v) => v + (parseInt(args.distance || '0'))),
    params: ['distance']
}