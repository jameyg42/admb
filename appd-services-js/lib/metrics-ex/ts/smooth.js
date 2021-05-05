const avg = require('../../stats/reducers').avg;
const extract = require('./extract');
const utils = require('./_util');

function movingAvg(window) {
    window = window || 5;
    return (dp, i, data) => {
        const before = Math.min(i, Math.round(window / 2));
        const after = window - before;

        const slice = data.slice(i-before, i+after);
        const vals = {};
        utils.values.forEach(v => {
            vals[v] = extract(v, slice);
        })

        const d = {start: dp.start};
        utils.values.forEach(v => {
            d[v] = vals[v].reduce(avg);
        });
        return d;
    };
}

module.exports = {
    movingAvg: movingAvg
};
