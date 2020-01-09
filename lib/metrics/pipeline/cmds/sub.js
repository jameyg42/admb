const Rx = require('rxjs');
const RxOp = require('rxjs/operators');

function parse(ctx, args) {
    const parser = require('../parser');
    const expr = /[(]([^)]+)[)]/.exec(args)[1];
    const sub = parser.parse(expr, ctx);
    return Rx.pipe(
//       RxOp.tap(x => console.log('BEFORE SUB', x.length, x.map(m => m.metricFullName).join(';;'))),
//        RxOp.tap(x => console.log('AFTER SUB', x.length, x.map(m => m.metricFullName).join(';;'))),
    );
}

module.exports = {
    parse: parse
}