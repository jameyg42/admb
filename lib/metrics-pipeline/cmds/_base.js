const _ = require('lodash');
const Rx = require('rxjs');
const RxOp = require('rxjs/operators');

function named(name, fn) {
    if (!name) return fn;
    return (ts) => {
        ts.transforms = ts.transforms || [];
        ts.transforms.push(name);
        const orig = ts.name;
        ts.name = `${name}(${orig})`
        return fn(ts);
    }
}
function forEachGroup(fn, ...ts) {
    const results = [];
    function _forEachGroup(fn, results, ts) {
        if (ts[0] && _.isArray(ts[0])) {
            for (const t of ts) {
                _forEachGroup(fn, results, t);
            }
        } else {
            const tsg = ts;
            const r = fn(tsg);
            if (r !== null) {
                results.push(_.isArray(r) ? r : [r]);
            }
        }
    }
    _forEachGroup(fn, results, ts);
    return results;
}
function forEachSeries(fn, ...ts) {
    const groups = [];
    function _deep(fn, gs, ts) {
        if (_.isArray(ts)) {
            const sgs = [];
            ts.forEach(t => _deep(fn, sgs, t));
            gs.push(sgs);
        } else {
            const r = fn(ts);
            if (r !== null) {
                gs.push(r);
            }
        }
    }
    _deep(fn, groups, ts);
    return groups;
}
function toArray(arg) {
    return arg.split(',').map(t => t.trim());
}
function values(ts) {
    return ts.data.map(d => d.value);
}

// are the following actually useful for general use?
function applyToValues(fn) {
    return apply((d, i, a) => ({start: d.start, value: fn(d.value, i, a)}));
}
function apply(fn) {
    return (ts) => {
        const data = ts.data.map(fn)
        ts.data = data;
        return ts;
    }
}

// utility to compile any command whose function simply transforms the values of
// each datapoint in a single series
function compileForGroup(nameOrFactory, groupFactoryFn) {
    if (_.isFunction(nameOrFactory)) {
        groupFactoryFn = nameOrFactory;
        nameOrFactory = null;
    }
    return (ctx, args) => {
        const groupFn = groupFactoryFn(ctx, args);
        return Rx.pipe(
            RxOp.map(r => {
                return forEachGroup(groupFn, ...r);
            })
        );
    }
}
function compileForSeries(nameOrFactory, seriesFactoryFn) {
    if (_.isFunction(nameOrFactory)) {
        seriesFactoryFn = nameOrFactory;
        nameOrFactory = null;
    }
    return (ctx, args) => {
        const seriesFn = seriesFactoryFn(ctx, args);
        return Rx.pipe(
            RxOp.map(r => {
                return forEachSeries(named(nameOrFactory, seriesFn),  ...r);
            })
        );
    }
}
function compileForValues(name, valuesFactoryFn) {
    return compileForSeries(name, (ctx, args) => {
        const valuesFn = valuesFactoryFn(ctx, args);
        return applyToValues(valuesFn)
    });
}

module.exports = {
    forEachGroup: forEachGroup,
    forEachSeries: forEachSeries,
    named: named,
    toArray: toArray,
    values: values,

    apply: apply,
    applyToValues: applyToValues,
 
    compileForGroup: compileForGroup,
    compileForSeries: compileForSeries,
    compileForValues: compileForValues,
}