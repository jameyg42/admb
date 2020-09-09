const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');
const noLessThan = require('../../metrics-ex/ts/apply').noLessThan;

function compile(ctx, args) {
    const floor = parseInt(args.val || '0');
    return Rx.pipe(
        RxOp.map(r => {
            return cmd.forEachSeries((ts) => noLessThan(floor, ts), ...r);
        })
    )
}

module.exports = {
    compile: compile,
    params: ['val']
}