const _ = require('lodash');
const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const util = require('../cmd-util');
const extract = require('../../ts/extract');
const reducers = require('../../../stats/reducers');


function compile(ctx, args) {
    function filterSeries(ts) {
        const min = extract.reduce.value(reducers.min, ts);
        const max = extract.reduce.value(reducers.max, ts);
        const avg = extract.reduce.value(reducers.avg, ts);
        const name = ts.metricName;
        const fullName = ts.metricFullName;
        const s = [''].concat(ts.node.path);
        const r = eval(args.expr); // TODO vm.runInContext instead of eval
        return r ? ts : null;
    }
    return Rx.pipe(
        RxOp.map(rs => util.forEachSeries(filterSeries, rs))
    )
}

module.exports = {
    compile: compile,
    params: ['expr']
}