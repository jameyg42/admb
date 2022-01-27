const stats = require('./stats')

function bounds(d) {
    const [q1,q2,q3] = stats.quartiles(d);

    const lowerBound = q1 - (1.5 * (q3 - q1));
    const upperBound = q3 + (1.5 * (q3 - q1));
    return [lowerBound, upperBound]
}
function outlier(d) {
    const [lowerBound, upperBound] = bounds(d);
    return d.map(p => Math.max(lowerBound, Math.min(upperBound, p)));
}
outlier.bounds = bounds;

module.exports = outlier;