const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');

function abs(ts) {
    
}

function compile(ctx, args) {
    return Rx.pipe(
        RxOp.map(r => {
            return cmd.forEachSeries(ts => abs(ts), ...r);
        })
    )
}

module.exports = {
    compile: compile,
    params: []
}