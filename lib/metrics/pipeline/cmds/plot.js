const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');

// simply adds metadata that can be used by the plot rendering system
// type is expected to be one of: line [default], bar, stacked-bar, area, stacked-area
// yaxis is 1 [default] or 2
// colors is a comma separated list of colors

function compile(ctx, args) {
    const pm = { };
    pm.type = args.type || 'line';
    pm.yaxis = args.yaxis || 1;

    // TODO group matching

    if (args.colors) {
        pm.colors = args.colors.split(',');
    }

    return Rx.pipe(
        RxOp.map(r => {
            return cmd.forEachSeries((ts) => {ts.plotLayout = pm; return ts;}, ...r);
        })
    )
}

module.exports = {
    compile: compile,
    params: ['type', 'yaxis', 'colors']
}