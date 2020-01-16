const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');

function compile(ctx, args) {
    
    function label(ts) {
        let g = [];
        if (args.rex) {
            const rex = new RegExp(args.rex);
            g = rex.exec(ts.metricFullName); 
        }
        const name = ts.name;
        const fullName = ts.fullName;
        const s = [''].concat(ts.node.path);
        const lt = '`'+args.value.replace(/`/g,'\\`') +'`';
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
    params: ['value', 'rex']
}