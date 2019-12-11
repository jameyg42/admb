const align = require('./align')
const util = require('./_util')
const sum = require('./reduce').sumSeries;
const {assign, noLessThan} = require('./apply');

function safe(n) {
    return isNaN(n) ? 0 : n || 0;
}

function asPercent(total, ...tss) {
    var r = tss
    .map(ts => {
        var [tsa,td] = align(ts, total)
        var zipped = util.zipValues(tsa.data, td.data)
        ts.data = zipped.map(tsz => {
            util.values.forEach(mv => {
                const [v, t] = tsz[mv];
                tsz[mv] = (safe(v) / Number.parseFloat(safe(t))) * 100;
            })
            return tsz;
        })
        return {
            metricName: `percentOf(${total.metricName},${ts.metricName})`,
            metricFullName: `percentOf(${total.metricFullName},${ts.metricFullName})`,
            range: total.range,
            precision: total.precision,
            values: total.values,
            data: ts.data
        };
    });
    return r;
}

module.exports = asPercent