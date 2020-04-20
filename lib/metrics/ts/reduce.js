const align = require('./align')
const util = require('./_util')
const reducers = require('@metlife/lib-stats/lib/reducers')


////
// functions that reduce a set of timeseries to a single timeseries
// START WITH
// data: [
//     {start: 100, value: 100, baseline: 105, stdev: 1.043, min: 70, max: 132 },
//     {start: 101, value: 100, baseline: 105, stdev: 1.043, min: 70, max: 132 },
// ]
// data: [
//     {start: 100, value: 200, baseline: 105, stdev: 1.043, min: 70, max: 132 },
//     {start: 101, value: 200, baseline: 105, stdev: 1.043, min: 70, max: 132 },
// ]
// ZIP and MAP TO
// [{
//     start: 100, 
//     value: [100,200], baseline: [105, 105], stddev: [1.043, 1.043], min: [70, 70], max: [132, 132]
// }, 
// ...
// and finally reduce each point with the reducer function
// ]



const reduceAllWith = function(reducer) {
    return util.values.reduce((m, p) => {
        m[p] = reducer;
        return m;
    }, {})
}



function reduce(alias, reducerMap, ...tss) {
    tss = align(...tss);
    if (tss.length == 0) {
        return tss;
    }

    const rts = {
        metricName: `${alias}(${tss.map(ts => ts.metricName).join(',')})`,
        metricFullName: `${alias}(${tss.map(ts => ts.metricFullName).join(',')})`,
        precision: tss[0].precision,
        range: tss[0].range,
        values: tss[0].values,
        node: tss[0].node
    };

    var seriesValues = tss.map(ts => ts.data)
    seriesValues = util.zipValues(...seriesValues);

    // now we can easily run a reducer on each value
    seriesValues = seriesValues.map(tp => {
        util.values.forEach(p => tp[p] = tp[p].reduce(reducerMap[p]))
        return tp;
    })

    rts.data = seriesValues;

    return rts;
}

module.exports = {
    reduce: (fn, ...tss) => reduce(fn, reduceAllWith(reducers[fn]), ...tss),
    sumSeries: (...tss) => reduce('sumSeries', reduceAllWith(reducers.sum), ...tss),
    diffSeries:(...tss) => reduce('diffSeries', reduceAllWith(reducers.diff), ...tss),
    mulSeries: (...tss) => reduce('mulSeries', reduceAllWith(reducers.product), ...tss),
    divSeries: (...tss) => reduce('divSeries', reduceAllWith(reducers.quotient), ...tss),
    minSeries: (...tss) => reduce('minSeries', reduceAllWith(reducers.min), ...tss),
    maxSeries: (...tss) => reduce('maxSeries', reduceAllWith(reducers.max), ...tss),
    avgSeries: (...tss) => reduce('avgSeries', reduceAllWith(reducers.avg), ...tss),
    combineSeries: (...tss) => reduce('combine', {
        value: reducers.avg,
        baseline: reducers.avg,
        min: reducers.min,
        max: reducers.max,
        stddev: reducers.avg
    }, ...tss),
};