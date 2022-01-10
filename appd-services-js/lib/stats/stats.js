const reducers = require('./reducers');
const groupBy = require('lodash').groupBy;

function sort(d, desc) {
    // default javascript sort is alphabetic and mutates the original array
    const clone = d.slice();
    return clone.sort((a,b) => desc ? b-a : a-b)
}
function rank(d) {
    const ranks = sort(d)
                  .filter((v, i, a) => i == 0 || a[i-1] != v) // dedupe
                  .reduce((r, v, i) => {
                      r[v] = i+1;
                      return r;
                  }, {});
    return d.map(v => ranks[v]);
}

function median(d) {
    if (d.length % 2 == 0) {
        const i = d.length / 2;
        return (parseFloat(d[i]) + parseFloat(d[i - 1])) / 2;
    }
    return d[Math.floor(d.length / 2)];
}
function mode(d) {
    const grouped = groupBy(d, String.valueOf(d))
    const sorted = Object.entries(grouped).sort((a,b) => b[1].length - a[1].length)
    return Number(sorted[0][0]);
}
function percentile(p, d) {
    const s = sort(d);
    const i = Math.floor(d.length * p);
    return s[i];
}

function quartiles(d) {
    const sorted = sort(d);
    const lower = sorted.slice(0, Math.floor(sorted.length / 2));
    const upper = sorted.slice(Math.ceil(sorted.length / 2));
    const q1 = median(lower);
    const q2 = median(sorted);
    const q3 = median(upper);

    return [q1,q2,q3];
}
function iqr(d) {
    const [q1,q2,q3] = quartiles(d);
    return q3 - q1;
}

module.exports = {
    sort: sort,
    rank: rank,
    mean: d => d.reduce(reducers.avg),
    mode: mode,
    median: median,
    percentile: percentile,
    quartiles: quartiles,
    iqr: iqr,

    sum: d => d.reduce(reducers.sum),
    product: d => d.reduce(reducers.product),
    diff: d => d.reduce(reducers.diff),
    min: Math.min,
    max: Math.max
}
