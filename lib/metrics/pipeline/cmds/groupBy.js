const _ = require('lodash');
const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');



function parse(ctx, args) {
    const kvps = cmd.kvps(args);
    const segment = kvps.segment;
    const rex = new RegExp(kvps.rex || '.*');
    function groupBy(g) {
        const gs = g.reduce((a,t) => {
            const matchAgainst = segment ? t.node.path[segment-1] : t.metricFullName;
            const matchAgainstFragments = rex.exec(matchAgainst) || ['##DEFAULT###'];
            const group = matchAgainstFragments.length == 1 ? matchAgainstFragments[0] : matchAgainstFragments.slice(1).join(',');
            a[group] = a[group] || [];
            a[group].push(t);
            return a;
        }, {});
        return Object.values(gs);
    }
    return Rx.pipe(
        RxOp.reduce((a,r) => 
            a = a.concat(...r)
        ,[]),
        RxOp.map(r => 
            cmd.forEachGroup(groupBy, ...r)
        )
    )
}

module.exports = {
    parse: parse
}