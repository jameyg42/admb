const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');
const derivative = require('../../ts/apply').derivative;

function compile(ctx, args) {
    return Rx.pipe(
        RxOp.map(r => {
            return cmd.forEachSeries(ts => derivative(ts), ...r);
        })
    )
}

module.exports = {
    compile: compile,
    params: []
}