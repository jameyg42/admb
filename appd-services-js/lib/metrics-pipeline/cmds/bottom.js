const base = require('./_base');
const reducers = require('../../stats/reducers');

function limitFn(ctx, args) {
    const size = args.size || 10;
    const by = args.by || 'avg';
    const byFn = reducers[by];
    if (!byFn) {
        throw new Error(`Invalid 'by' function '${by}'`);
    }
    return (g) => {
        return g.sort((a, b) => {
            const ar = base.values(a).reduce(byFn);
            const br = base.values(b).reduce(byFn);
            return ar - br;
        }).slice(0, size);
    }
}

module.exports = {
    compile: base.compileForGroup(limitFn),
    params: ['size', 'by']
}