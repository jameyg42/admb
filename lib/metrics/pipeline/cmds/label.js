const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');

function compile(ctx, args) {
    
    function label(ts) {
        let g = [];
        const expr = args.expr || '${fullName}'
        const name = ts.metricNname;
        const fullName = ts.metricFullName;
        const s = [''].concat(ts.node.path);
        const lt = '`'+expr.replace(/`/g,'\\`') +'`';
        const l = eval(lt);
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