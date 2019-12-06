const normalize = require('./normalize')
const util = require('./_util')
const sum = require('./reduce').sumSeries;
const {assign, noLessThan} = require('./apply');


function asPercent(total, ...tss) {
    var r = tss
    .map(ts => util.merge(ts, {
        name: `asPercent(${ts.name})`,
        uniqueName: `asPercent(${ts.uniqueName})`
    }))
    .map(ts => {
        var td;
        if (!total.data) {
            td = assign(total, ts);
        } else {
            [ts,td] = normalize(ts, total)
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