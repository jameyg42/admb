const _ = require('lodash');
const base = require('./_base');
const reducers = require('../../stats/reducers');

function reduce(ctx, args) {
    const fn = args.fn;
    if (!fn) {
        throw new Error(`no reduce function specified for args '${args}'`);
    }
    const reducer = reducers[fn];
    if (!reducer) {
        throw new Error(`Invalid reducer function '${fn}'`);
    }

    return (g) => {
        g = base.normalizeRange(g);
        const result = _.clone(g[0]);
        result.name = `reduce:${fn}(${g.map(ts => ts.name).join(',')})`;

        const allValues = g.map(base.values);
        const allValuesZipped = _.zip(...allValues);
        const allValuesReduced = allValuesZipped.map(vs => vs.reduce(reducer));
        base.applyToValues((v, i) => allValuesReduced[i])(result);
        return result;
    }
}

module.exports = {
    compile: base.compileForGroup(reduce),
    params: ['fn']
}