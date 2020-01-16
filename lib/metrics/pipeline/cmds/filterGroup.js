const _ = require('lodash');
const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const util = require('../cmd-util');
const extract = require('../../ts/extract');
const reducers = require('@metlife/lib-stats/lib/reducers');
const glob = require('../../../glob');


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
        const min = extract.reduce.value(reducers.min, ts);
        const max = extract.reduce.value(reducers.max, ts);
        const avg = extract.reduce.value(reducers.avg, ts);
        const r = eval(args.expr); // TODO vm.runInContext instead of eval
        return r ? ts : null;
    }
    return Rx.pipe(
        RxOp.map(rs => util.forEachGroup(filterGroup, rs))
    )
}

module.exports = {
    compile: compile,
    params: ['matching', 'expr' ]
}