const base = require('./_base');
const reducers = require('../../stats/reducers');

function seriesFactoryFn(ctx, args) {
    return (ts) => {
        const min = base.values(ts).reduce(reducers.min);
        const max = base.values(ts).reduce(reducers.max);
        const avg = base.values(ts).reduce(reducers.avg);
        const name = ts.path[ts.path.length - 1];
        const fullName = ts.name;
        const s = [ts.app].concat(ts.path);
        const r = eval(args.expr); // TODO vm.runInContext instead of eval
        return r ? ts : null;
    }
}

module.exports = {
    compile: base.compileForSeries(seriesFactoryFn),
    params: ['expr']
}