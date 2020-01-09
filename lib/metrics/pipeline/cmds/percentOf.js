const cmd = require('../cmd-util');
const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const asPercent = require('../../ts/percentOf');

function percentOf(g) {
    const c = g.slice();
    const t = c.shift();
    return asPercent(t, ...c);
}

function compile(ctx, args) {
    return Rx.pipe(
        RxOp.map(r => {
            return cmd.forEachGroup(percentOf, ...r);
        })
    )
}

module.exports = {
    compile: compile,
    params: []
}