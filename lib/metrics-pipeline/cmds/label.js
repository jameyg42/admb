const base = require('./_base');
const _ = require('lodash');
const tmpl = require('../../tmpl');

function compile(ctx, args) {
    return (ts) => {
        const expr = args.expr || '%{name}'
        const model = Object.assign({
            args: args,
            ctx: ctx,
            n: ts.path[ts.path.length-1],
            s: [ts.app].concat(ts.path)
        }, ts);

        const l = tmpl.eval(expr, model);
        ts.name = l;
        return ts;
    }
}

module.exports = {
    compile: base.compileForSeries(compile),
    params: ['expr']
}