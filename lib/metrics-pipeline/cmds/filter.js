const _ = require('lodash');
const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const base = require('./_base');
const extract = require('../../metrics-ex/ts/extract');
const reducers = require('../../stats/reducers');


function compile(ctx, args) {
    function filterSeries(ts) {
        const min = extract.reduce.value(reducers.min, ts);
        const max = extract.reduce.value(reducers.max, ts);
        const avg = extract.reduce.value(reducers.avg, ts);
        const name = ts.path[ts.path.length - 1];
        const fullName = ts.name;
        const s = [ts.app].concat(ts.path);
        const r = eval(args.expr); // TODO vm.runInContext instead of eval
        return r ? ts : null;
    }
    return Rx.pipe(
        RxOp.map(rs => base.forEachSeries(filterSeries, rs))
    )
}

module.exports = {
    compile: compile,
    params: ['expr']
}