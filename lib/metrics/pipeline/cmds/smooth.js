const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');
const movingAvg = require('../../ts/apply').movingAvg;



function compile(ctx, args) {
    const window = parseInt(args.window || '5');
    return Rx.pipe(
        RxOp.map(r => {
            return cmd.forEachSeries(ts => movingAvg(window, ts), ...r);
        })
    )
}

module.exports = {
    compile: compile,
    params: ['window']
}