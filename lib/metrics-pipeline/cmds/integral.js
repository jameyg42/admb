const base = require('./_base');

module.exports = {
    compile: base.compileForSeries('integral', (ctx,args) => (ts) => {
        ts.data.forEach((d, i, a) => d.value += (i > 0 ? a[i-1].value : 0));
        return ts;
    }),
    params: []
}