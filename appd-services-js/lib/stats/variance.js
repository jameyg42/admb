const reducers = require('./reducers')
const mean = require('./stats').mean;

function variance(x) {
    if (x.length == 0) return 0;
    const mx = mean(x);
    const variance = x
        .map(d => d - mx)
        .map(d => d*d)
        .reduce(reducers.avg)
    return variance;
}

module.exports = {
    variance: variance,
    stddev: x => Math.sqrt(variance(x))
}
