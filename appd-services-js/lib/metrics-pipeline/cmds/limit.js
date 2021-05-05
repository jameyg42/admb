const base = require('./_base');

function limitFn(ctx, args) {
    const size = args.size || 10;
    return (g) => {
        return g.slice(0, size);
    }
}

module.exports = {
    compile: base.compileForGroup(limitFn),
    params: ['size']
}