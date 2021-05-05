const Rx = require('rxjs');
const compile = require('./compiler');

function exec(expr, range, providers, vars) {
    const ctx = {
        providers: providers,
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



module.exports = (providers) => {
    // backwards compat - if the "providers" is actually an appd-client, create
    // a metrics-ex provider using it
    if (providers.info) {
        console.log('AppD client provided instead of providers instance - entering backward compat mode')
        console.log(providers);
        const client = providers;
        providers = require('./providers')();
        const appd = require('./providers/metrics-ex-provider')(client);
        providers.register('appd', appd);
    }
    return {
        exec: (expr, range, vars) => exec(expr, range, providers, vars)
    }
};