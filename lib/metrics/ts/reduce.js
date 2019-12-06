const normalize = require('./normalize')
const util = require('./_util')
const reducers = require('@metlife/lib-stats/reducers')


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
    tss = normalize(...tss);

    const rts = {
        name: `${alias}(${tss.map(ts => ts.uniqueName).join(',')})`,
        frequency: tss[0].frequency
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