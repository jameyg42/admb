const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');
const outlier = require('@metlife/lib-stats/lib/outlier');

function truncateToQuartile(ts) {
    const clone = Object.assign({data: ts.data.slice()}, ts);
    const values = clone.data.map(s => s.value);
    const truncated = outlier(values);
    clone.data.forEach((s,i) => s.value = truncated[i]);
    return clone;
}

function parse(ctx, args) {
    return Rx.pipe(
        RxOp.map(r => {
            return cmd.forEachSeries(truncateToQuartile, ...r);
        })
    )
}

module.exports = {
    parse: parse
}