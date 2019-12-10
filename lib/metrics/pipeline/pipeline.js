const Rx = require('rxjs');
const parse = require('./parser')


function exec(expr, app, range, client) {
    const ctx = {
        metrics: require('../metricsEx')(client),
        appStack: [app],
        rangeStack: [range],
        app: () => ctx.appStack.slice(-1).pop(),
        range: () => ctx.rangeStack.slice(-1).pop(),
    };


    return new Promise(resolve => {
        const pipelineCommands = parse(expr, ctx);
        Rx.from(Promise.resolve([])).pipe(
            ...pipelineCommands
        ).subscribe(resolve);
    });
}



module.exports = (client) => ({
    exec: (expr, app, range) => exec(expr, app, range, client)
});