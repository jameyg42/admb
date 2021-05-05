const reducers = require('./reducers')
const round = require('./round').round;

function variance(data) {
    if (data.length == 0) return 0;
    const avg = round(data.reduce(reducers.avg), 3);
    const variance = data
        .map(d => d - avg)
        .map(d => round(d, 3))
        .map(d => d*d)
        .reduce(reducers.avg)
    return round(variance, 3);
}

module.exports = {
    variance: variance,
    stddev: d => Math.sqrt(variance(d))
}