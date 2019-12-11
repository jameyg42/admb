const Rx = require('rxjs');
const parser = require('./parser');


function exec(expr, app, range, client) {
    const ctx = {
        metrics: require('../metricsEx')(client),
        appStack: [app],
        rangeStack: [range],
        app: () => ctx.appStack.slice(-1).pop(),
        range: () => ctx.rangeStack.slice(-1).pop(),
    };


    return new Promise((resolve, reject) => {
        const results = [];
        const pipelineCommands = parser.parse(expr, ctx);
        Rx.of([]).pipe(
            ...pipelineCommands
        ).subscribe({
            next: (p) => results.push(p),
            complete: () => resolve(results),
            error: (e) => reject(e)
        });
    });
}



module.exports = (client) => ({
    exec: (expr, app, range) => exec(expr, app, range, client)
});