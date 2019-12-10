const Rx = require('rxjs');
const RxOp = require('rxjs/operators');

function parse(ctx, args) {
    const searches = args.split(';');

    return Rx.pipe(
        RxOp.flatMap(r => searches.map(s => ctx.metrics.fetchMetrics(ctx.app(), s, ctx.range()))),
        RxOp.mergeAll()
    );
}

module.exports = {
    parse: parse,
}
