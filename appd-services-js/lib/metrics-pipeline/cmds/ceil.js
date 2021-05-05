const base = require('./_base');

module.exports = {
    compile: base.compileForValues('ceil', (ctx, args) => (v) => Math.min(parseInt(args.val || '0'), v)),
    params: ['val']
}