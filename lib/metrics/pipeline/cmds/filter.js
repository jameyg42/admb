const _ = require('lodash');
const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');
const extract = require('../../ts/extract');
const reducers = require('@metlife/lib-stats/lib/reducers');
function parse(ctx, args) {
    const kwargs = cmd.kvps(args);
    const byName = kwargs.name ? new RegExp(kwargs.name) : null;
    const alt = kwargs.alt ? parseInt(kwargs.alt) : null;
    const agt = kwargs.agt ? parseInt(kwargs.agt) : null;

    const filter = (ts) => {
        const groups = [];
        function _deep(gs, ts) {
            if (_.isArray(ts)) {
                const sgs = [];
                ts.forEach(t => _deep(sgs, t));
                gs.push(sgs);
            } else {
                if (byName && !byName.test(ts.metricFullName)) {
                    return;
                }
                if ((alt || agt) != null) {
                    const vals = extract.value(ts);
                    const avg = vals.reduce(reducers.avg);
                    if (alt != null && avg >= alt) {
                        return;
                    }
                    if (agt != null && avg <= agt) {
                        return;
                    }
                }
                gs.push(ts);
            }
        }
        _deep(groups, ts);
        return groups;
    }
    return Rx.pipe(
        RxOp.map(r => filter(r))
    )
}

module.exports = {
    parse: parse
}