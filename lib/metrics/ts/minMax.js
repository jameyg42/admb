const reducers = require('../../stats/reducers');
const extract = require('./extract');
const utils = require('./_util');

function minMax(dp, i, data) {
    const vals = {};
    utils.values.forEach(v => {
        vals[v] = extract(v, data);
    });

    const d = {start: dp.start};
    utils.values.forEach(v => {
        const val = vals[v];
        const min = val.reduce(reducers.min);
        const max = val.reduce(reducers.max);
        d[v] = (dp[v] - min) / (max - min);
    });
    return d;
}

module.exports =  minMax;
