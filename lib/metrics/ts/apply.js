const normalize = require('./normalize')
const util = require('./_util')

////
// transform all the values of a given set of timeseries with a given function
// NOTE that we're currently "cloning" the input timeseries with Object.assign
// assuming that the source timeseries is semantically immutable

function apply(alias, fn, ...tss) {
    const r = tss.map(ts => util.merge(ts, {
        name: `${alias}(${ts.name})`,
        uniqueName: `${alias}(${ts.uniqueName})`,
        data: ts.data.map(fn)
    }))
    return r.length == 1 ? r[0] : r
}
function transformAllWith(fn) {
    return dp => {
        var d = {start: dp.start}
        util.values.forEach(v => d[v] = fn(dp[v], v));
        return d;
    }
}
function transformValueWith(val, fn) {
    return dp => util.merge(dp, {val:fn(dp[val])})
}

module.exports = {
    scale: (factor, ...tss) => apply('scale', transformAllWith(v => factor * v), ...tss),
    abs: (...tss) => apply('abs', transformAllWith(v => Math.abs(v)), ...tss),
    assign: (value, ...tss) => apply('assign', transformAllWith((v,k) => typeof value == 'number' ? value : (value[k] || v)), ...tss),
    noLessThan: (floor, ...tss) => apply('noLessThan', transformAllWith(v => Math.max(floor, v)), ...tss),
    noMoreThan: (ceiling, ...tss)=> apply('noMoreThan', transformAllWith(v => Math.min(ceiling, v)), ...tss)
}