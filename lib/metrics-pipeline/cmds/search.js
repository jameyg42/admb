const _ = require('lodash');
const Rx = require('rxjs');
const RxOp = require('rxjs/operators');

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
    // NOTE : unlike other commands, the second argument to search is the entire AST, not the arguments object
    if (ast.op !== 'search') {
        throw new Error(`illegal AST - expected SEARCH operation but got ${ast.op}`);
    }
    const pipes = ast.pipes.map(p => pipe(ctx, p));

    const search = Rx.of(ast.paths).pipe(
        RxOp.flatMap(path => 
            ctx.provider.findApps(path.app)
            .then(apps => {
                path.matchingApps = apps;
                return path;
            })
        ),
        RxOp.flatMap(path => 
            Promise.all(path.matchingApps.map(app => ctx.provider.fetchMetrics(app, path.path, path.values, ctx.defaultRange)))
        ),
        RxOp.map(metrics => _.flattenDeep(metrics)),
        Rx.pipe(...pipes)
    );
    return Rx.pipe(
        RxOp.flatMap(priorResults => priorResults == null ? search : Rx.concat(Rx.of(priorResults), search))
    );
}

module.exports = {
    compile: compile,
}
