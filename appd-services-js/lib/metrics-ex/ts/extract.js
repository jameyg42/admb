const metricValues = require('./_util').values

////
// 
function extract(vals, ...tssOrData) {
    var r = tssOrData
        .map(tsOrD => tsOrD.data ? tsOrD.data : tsOrD)
        .map(d => d.map(v => {
                if (Array.isArray(vals)) {
                    var o = {};
                    vals.forEach(k => o[k] = v[k]);
                    return o;
                }
                return v[vals];
            })
        )
    return r.length > 1 ? r : r[0];
}
extract.reduce = (fn, v, ...tss) => {
    var vs = extract(v, ...tss);
    if (tss.length == 1) {
        return vs.reduce(fn);
    }
    return vs.map(v => v.reduce(fn));
}

metricValues.forEach(v => extract[v] = (...tss) => extract(v, ...tss));
metricValues.forEach(v => extract.reduce[v] = (fn, ...tss) => extract.reduce(fn, v, ...tss))

module.exports = extract;
