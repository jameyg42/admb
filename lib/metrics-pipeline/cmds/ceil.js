const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');
const noMoreThan = require('../../metrics-ex/ts/apply').noMoreThan;

function compile(ctx, args) {
    const ceil = parseInt(args.val || '0');
    return Rx.pipe(
        RxOp.map(r => {
            return cmd.forEachSeries((ts) => noMoreThan(ceil, ts), ...r);
        })
    )
}

module.exports = {
    compile: compile,
    params: ['val']
}