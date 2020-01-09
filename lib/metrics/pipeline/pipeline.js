const Rx = require('rxjs');
const compile = require('./compiler');


function exec(expr, app, range, client) {
    const ctx = {
        client: client,
        defaultApp: app,
        defaultRange: range
    };

    return new Promise((resolve, reject) => {
        const results = [];
        const pipeline = compile(ctx, expr);
        Rx.of(null).pipe(
            pipeline
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