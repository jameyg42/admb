const _ = require('lodash');
const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const base = require('./_base');
const reducers = require('../../stats/reducers');
const glob = require('../../glob');


function compile(ctx, args) {
    const matching = args.matching || 'every';

    function filterGroup(g) {
        let r;
        if (matching === 'every' || matching === 'some') {
            r = g[matching](filterSeries);
        } else {
            r = g.filter(ts => !_.isArray(ts) && glob.matches(matching, ts.metricFullName))
                 .every(filterSeries);
        }
        return r ? g : null;

    }
    function filterSeries(ts) {
        const min = base.values(ts).reduce(reducers.min);
        const max = base.values(ts).reduce(reducers.max);
        const avg = base.values(ts).reduce(reducers.avg);
        const r = eval(args.expr); // TODO vm.runInContext instead of eval
        return r ? ts : null;
    }
    return Rx.pipe(
        RxOp.map(rs => base.forEachGroup(filterGroup, rs))
    )
}

module.exports = {
    compile: compile,
    params: ['matching', 'expr' ]
}