const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');
const scale = require('../../ts/apply').scale;

const params = ['factor'];
function compile(ctx, args) {
    return Rx.pipe(
        RxOp.map(r => {
            return cmd.forEachSeries((ts) => scale(args.factor, ts), ...r);
        })
    )
}

module.exports = {
    compile: compile,
    params: params
}