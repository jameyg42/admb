const util = require('./_util');

////
// aligns a set of normalized timeseries so the data points for all the
// ts line up with each other.
// For now, this will remain unimplemented since we don't yet support fetching
// timeseries using different ranges (so they'll already be aligned)

function align(...ts) {
    return tss.map(util.clone)
}


module.exports = align;