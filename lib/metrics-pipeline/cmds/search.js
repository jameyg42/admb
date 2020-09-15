const _ = require('lodash');
const Rx = require('rxjs');
const RxOp = require('rxjs/operators');

const appSvc = require('../../app');
const metricsExSvc = require('../../metrics-ex');
const glob = require('../../glob');
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
function parseValue(value) {
    const parser = /^([^@]+)(?:@(.*))?$/;
    const v = parser.exec(value);
    return {
        value: v[1],
        baseline: v[2]
    };
}
function parseValues(values) {
    values = values || 'value';
    values = values.split(',').map(parseValue);
    return values;
}
function fetchMetrics(client, app, range, path, values) {
    values = parseValues(values);
    return Promise.all(values.map(v => fetchAndNormalizeMetrics(client, app, range, path, v.value, v.baseline)));
}

function fetchAndNormalizeMetrics(client, app, range, path, value, baseline) {
    return metricsExSvc(client).fetchMetrics(app, path, range, baseline)
        .then(tss => 
            tss.map(ts => {
                const nts = { 
                    name: `${ts.node.app.name}:|${ts.node.path.join('|')}[${value}${baseline ? '@'+baseline : ''}]`,
                    data: ts.data.map(d => ({
                        start: d.start,
                        value: d[value]
                    }))
                };
                return nts;
            })
        );
}
function compile(ctx, ast) {
    // NOTE : unlike other commands, the second argument to search is the entire AST, not the arguments object
    if (ast.op !== 'search') {
        throw new Error(`illegal AST - expected SEARCH operation but got ${ast.op}`);
    }
    const pipes = ast.pipes.map(p => pipe(ctx, p));

    const search = Rx.of(ast.paths).pipe(
        RxOp.flatMap(path => 
            appSvc(ctx.client)
                .fetchAllApps()
                .then(apps => {
                    path.matchingApps = apps.filter(app => glob.matches(path.app, app.name))
                    return path;
                })
        ),
        RxOp.flatMap(path => 
            Promise.all(path.matchingApps.map(app => fetchMetrics(ctx.client, app, ctx.defaultRange, path.path, path.values)))
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
