const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');
const scale = require('../../ts/apply').scale;

function parse(ctx, args) {
    const factor = parseFloat(args);

    return Rx.pipe(
        RxOp.map(r => {
            return cmd.forEachSeries((ts) => scale(factor, ts), ...r);
        })
    )
}

module.exports = {
    parse: parse
}