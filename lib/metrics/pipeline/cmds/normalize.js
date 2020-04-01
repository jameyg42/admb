const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');
const normalize = require('../../ts/apply').minMax;

function compile(ctx, args) {
    return Rx.pipe(
        RxOp.map(r => {
            return cmd.forEachSeries(normalize,  ...r);
        })
    )
}

module.exports = {
    compile: compile,
    params: []
}