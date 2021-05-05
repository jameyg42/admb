const base = require('./_base');


module.exports = {
    compile: base.compileForSeries('binary', (ctx, args) => (ts) => {
        ts.plotLayout= ts.plotLayout || {}
        ts.plotLayout.shape = 'hv';
        ts.data.forEach(d => d.value = d.value == 0 ? 0 : 1);
        return ts;
    }),
    params: []
}
