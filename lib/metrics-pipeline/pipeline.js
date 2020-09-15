const Rx = require('rxjs');
const compile = require('./compiler');
const provider = require('./metrics-ex-provider');

function exec(expr, range, client, vars) {
    const ctx = {
        provider: provider(client),
        vars: vars,
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
    exec: (expr, range, vars) => exec(expr, range, client, vars)
});