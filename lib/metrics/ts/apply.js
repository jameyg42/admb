const util = require('./_util')

////
// transform all the values of a given set of timeseries with a given function
// NOTE that we're currently "cloning" the input timeseries with Object.assign
// assuming that the source timeseries is semantically immutable

function apply(alias, fn, ...tss) {
    const r = tss.map(ts => util.merge(ts, {
        metricName: `${alias}(${ts.metricName})`,
        metricFullName: `${alias}(${ts.metricFullName})`,
        range: ts.range,
        precision: ts.precision,
        values: ts.values,
        node: ts.node,
        data: ts.data.map(fn)
    }))
    return r.length == 1 ? r[0] : r
}
function transformAllWith(fn) {
    return (dp,i,a) => {
        var d = {start: dp.start}
        util.values.forEach(v => d[v] = fn(dp[v], v, i, a));
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
    noMoreThan: (ceiling, ...tss)=> apply('noMoreThan', transformAllWith(v => Math.min(ceiling, v)), ...tss),
    binary: (...tss) => apply('binary', transformAllWith(v => v == 0 ? 0 : 1)),
    derivative: (...tss) => apply('derivative', transformAllWith((v,k,i,d) => i === 0 ? 0 : v - (d[i-1][k])) , ...tss),
}