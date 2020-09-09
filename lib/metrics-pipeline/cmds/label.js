const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');
const _ = require('lodash');
const tmpl = require('../../tmpl');

function compile(ctx, args) {
    
    function label(ts) {
        const expr = args.expr || '%{fullName}'
        const model = {
            name: ts.metricName,
            fullName: ts.metricFullName,
            s: [_.get(ts, 'node.app.name', 'unknown')].concat(_.get(ts, 'node.path', [])),
            app: _.get(ts, 'node.app.name', 'unknown'),
            ts: ts,
            args: args,
            ctx: ctx
        };

        const l = tmpl.eval(expr, model);
        ts.metricName = l;
        ts.metricFullName = l;
        return ts;
    }
    return Rx.pipe(
        RxOp.map(r => {
            return cmd.forEachSeries(label, ...r);
        })
    )
}

module.exports = {
    compile: compile,
    params: ['expr']
}