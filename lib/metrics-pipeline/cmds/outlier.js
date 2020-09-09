const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');
const outlier = require('../../stats/outlier');

function truncateToQuartile(ts) {
    const clone = Object.assign({data: ts.data.slice()}, ts);
    const values = clone.data.map(s => s.value);
    const truncated = outlier(values);
    clone.data.forEach((s,i) => s.value = truncated[i]);
    return clone;
}

function compile(ctx, args) {
    return Rx.pipe(
        RxOp.map(r => {
            return cmd.forEachSeries(truncateToQuartile, ...r);
        })
    )
}

module.exports = {
    compile: compile,
    params: []
}