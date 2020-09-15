const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const base = require('./_base');
const _ = require('lodash');
const tmpl = require('../../tmpl');

function compile(ctx, args) {
    function label(ts) {
        const expr = args.expr || '%{name}'
        const model = Object.assign({
            args: args,
            ctx: ctx,
            s: [ts.app].concat(ts.path)
        }, ts);

        const l = tmpl.eval(expr, model);
        ts.name = l;
        return ts;
    }
    return Rx.pipe(
        RxOp.map(r => {
            return base.forEachSeries(label, ...r);
        })
    )
}

module.exports = {
    compile: compile,
    params: ['expr']
}