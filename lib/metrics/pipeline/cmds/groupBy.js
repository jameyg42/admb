const _ = require('lodash');
const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');



function parse(ctx, args) {
    const segment = cmd.kvps(args).segment;
    function groupBy(g) {
        const gs = g.reduce((a,t) => {
            const s = t.node.path[segment-1] || 'unknown';
            a[s] = a[s] || [];
            a[s].push(t);
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