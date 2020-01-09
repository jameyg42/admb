const Rx = require('rxjs');
const RxOp = require('rxjs/operators');

const appSvc = require('../../../app');
const metricsExSvc = require('../../metricsEx');
const cmdMap = require('./index');

// FIXME : most of this logic should be moved into compile.js

function pipe(ctx, p) {
    if (p.op === 'search') {
        return compile(ctx, p)
    }

    const cmd = cmdMap[p.op];
    if (cmd == null) {
        throw new Error(`Unknown command '${p.op}`);
    }
    // the expectation around how positioned parameters are handled when mixed with named parameters
    // will likely vary with the individual - since it's easy to implement, we're choosing to handle
    // it by removing all the provided named parameters from the list, then using the position of the
    // remaining to name those provided w/out a name
    const positionArgs = p.args.filter(a => a.name == null);
    const positionCandidates = cmd.params.filter(param => !p.args.some(a => param === a.name));
    const cmdArgs = positionArgs.reduce((a,c,i) => {
        if (i <= positionCandidates.length) {
            a[positionCandidates.shift()] = c.value;
        }
        return a;
    }, p.args.reduce((a,c) => {
        if (c.name) {
            a[c.name] = c.value;
        }
        return a;
    },{}));
    positionCandidates.forEach(p => cmdArgs[p] = null);

    return cmd.compile(ctx, cmdArgs);
}
function compile(ctx, ast) {
    if (ast.op !== 'search') {
        throw new Error(`illegal AST - expected SEARCH operation but got ${ast.op}`);
    }
    const pipes = ast.pipes.map(p => pipe(ctx, p));

    const search = Rx.of([]).pipe(
        RxOp.flatMap(_ => {
            // step 1 : find the app(s)
            if (ast.ctx && ast.ctx.app) {
                return appSvc(ctx.client)
                    .fetchAllApps()
                    .then(apps => apps.filter(app => new RegExp(`.*${ast.ctx.app}.*`, 'i').test(app.name)))
            } else {
                return Promise.resolve([ctx.defaultApp]);
            }
        }),
        // TODO : step 2 : fetch baselines, if necessary
        RxOp.flatMap(apps => 
            // step 3: fetch metrics
            Promise.all(apps
                .map(app => ast.paths.map(p => [app,p]))
                .reduce((a,c) => a.concat(c), [])
                .map(([app,path]) => metricsExSvc(ctx.client).fetchMetrics(app, path, ctx.defaultRange))
            ).then(results => results.reduce((a,c) => a.concat(c), []))
        ),
        Rx.pipe(...pipes)
    );
    return Rx.pipe(
        RxOp.flatMap(priorResults => priorResults == null ? search : Rx.concat(Rx.of(priorResults), search))
    );
}

module.exports = {
    compile: compile,
}
