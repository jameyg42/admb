const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const base = require('./_base');

// simply adds metadata that can be used by the plot rendering system
// type is expected to be one of: line [default], bar, stacked-bar, area, stacked-area
// yaxis is 1 [default] or 2
// colors is a comma separated list of colors

function compile(ctx, args) {
    const pm = { };
    pm.type = args.type || 'line';
    pm.yaxis = args.yaxis || 1;

    if (args.vals) {
        pm.vals = base.toArray(args.vals);
    }
    if (args.colors) {
        pm.colors = base.toArray(args.colors);
    }
    return (ts) => Object.assign(ts, {plotLayout: pm})
}

module.exports = {
    compile: base.compileForSeries(compile),
    params: ['type', 'vals', 'yaxis', 'colors']
}