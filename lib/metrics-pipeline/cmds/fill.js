const base = require('./_base');
const fill = require('../../stats/fill');

function fillSeries() {
    return (ts) => {
        // for now, null values are filled in with 0 by the appd-metrics provider
        // as a quick workaround to aggregating to NaN.  So we'll actually fill
        // 0 values here using simple linear interpolation
        
        // if we're 0% 0s or greater than 70% 0s don't fill
        const nonZeros = ts.data.filter(d => d.value != 0);
        const totalZeros = ts.data.length - nonZeros.length;
        if (totalZeros == 0 || (totalZeros / ts.data.length) > .7) {
            return ts;
        }

        // create the sparse array that stats/fill can operate on
        const vals = ts.data.map(d => d.value == 0 ? null : d.value);
        const filled = fill(vals);

        // replace the TS values w/ the filled in array values
        ts.data.forEach((d, i) => d.value = filled[i]);
        return ts;
    }
}

module.exports = {
    compile: base.compileForSeries('fill', fillSeries),
    params: []
}