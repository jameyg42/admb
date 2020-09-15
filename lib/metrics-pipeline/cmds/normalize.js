const base = require('./_base');
const reducers = require('../../stats/reducers');

function minMax(ts) {
    const vals = base.values(ts);
    const min = vals.reduce(reducers.min);
    const max = vals.reduce(reducers.max);

    return base.applyToValues((v) => 
        (v - min) / (max - min)
    )(ts);
}

module.exports = {
    compile: base.compileForSeries('normalize', (ctx, args) => minMax),
    params: []
}