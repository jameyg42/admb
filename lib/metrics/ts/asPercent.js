const align = require('./align')
const util = require('./_util')
const sum = require('./reduce').sumSeries;
const {assign, noLessThan} = require('./apply');


function asPercent(total, ...tss) {
    var r = tss
    .map(ts => ({
        metricName: `asPercent(${total.metricName},${ts.metricName})`,
        metricFullName: `asPercent(${total.metricFullName},${ts.metricFullName})`,
        range: total.range,
        precision: total.precision,
        values: total.values,
    }))
    .map(ts => {
        var td;
        if (!total.data) {
            td = assign(total, ts);
        } else {
            [ts,td] = align(ts, total)
        }
        var zipped = util.zipValues(ts.data, td.data)
        ts.data = zipped.map(tsz => {
            util.values.forEach(mv => {
                const [v, t] = tsz[mv];
                tsz[mv] = (v / Number.parseFloat(t)) * 100;
            })
            return tsz;
        })
        return ts;
    })

    return r.length == 1 ? r[0] : r
}

module.exports = asPercent