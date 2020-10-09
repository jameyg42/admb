const base = require('./_base');
const min = require('../../stats/reducers').min;

module.exports = {
    compile: base.compileForSeries('toZero', (ctx,args) => (ts) => {
        const offset = base.values(ts).reduce(min);
        ts.data.forEach(d => d.value -= offset);
        return ts;
    }),
    params: []
}