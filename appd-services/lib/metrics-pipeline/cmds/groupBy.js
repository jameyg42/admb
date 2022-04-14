const _ = require('lodash');
const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const base = require('./_base');

function compile(ctx, args) {
    const segment = args.segment;
    const rex = new RegExp(args.rex || '.*');
    function groupBy(g) {
        const gs = g.reduce((a,t) => {
            const matchAgainst = segment 
                ? (segment === 'app' ? t.app : t.path[segment-1]) 
                : t.name;
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
            base.forEachGroup(groupBy, ...r)
        )
    )
}

module.exports = {
    compile: compile,
    params: ['segment', 'rex']
}