const _ = require('lodash');
const mean = require('./stats').mean;
const stddev = require('./variance').stddev;
const sum = require('./reducers').sum;
const rank = require('./stats').rank;

function covariance(x, y) {
    const mx = mean(x);
    const my = mean(y);

    return _.zip(x, y)
            .map(([ix, iy], i, a) => ( (ix - mx) * (iy - my) ) / a.length)
            .reduce(sum);
}

function pearson(x, y) {
    return covariance(x, y) / (stddev(x) * stddev(y));
}
function spearman(x, y) {
    return pearson(rank(x), rank(y));
}

module.exports = {
    covariance: covariance,
    pearson: pearson,
    spearman: spearman
}
