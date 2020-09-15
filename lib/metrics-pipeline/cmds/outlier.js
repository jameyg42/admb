const base = require('./_base');
const outlier = require('../../stats/outlier');

function truncateToQuartile(ts) {
    const values = base.values(ts);
    const truncated = outlier(values);
    return base.applyToValues((v, i) => truncated[i])(ts);
}

module.exports = {
    compile: base.compileForSeries('outlier', (ctx, args) => truncateToQuartile),
    params: []
}