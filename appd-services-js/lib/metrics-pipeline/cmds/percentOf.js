const base = require('./_base');
const _ = require('lodash');

function percentOf(g) {
    const first = g[0];
    const firstValues = base.values(first);

    const rest = g.slice(1);
    const result = rest.map(ts => {
        base.applyToValues((v, i) => (firstValues[i] == 0 ? 0 : v / firstValues[i]) * 100)(ts);
        ts.name = `percentOf(${ts.name}:${first.name})`;
        return ts;
    });
    return result;
}

module.exports = {
    compile: base.compileForGroup('percentOf', (ctx, args) => percentOf),
    params: []
}