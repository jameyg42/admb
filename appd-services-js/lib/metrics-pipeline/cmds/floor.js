const base = require('./_base');

module.exports = {
    compile: base.compileForValues('floor', (ctx, args) => (v) => Math.max(parseInt(args.val || '0'), v)),
    params: ['val']
}