const _ = require('lodash');
const Rx = require('rxjs');
const RxOp = require('rxjs/operators');

function interval(start, step, len) {
    const interval = [];
    for (let i = 0; i < len; i++) {
        interval.push({
            start: start + (i * step),
            value: 0
        });
    } 
    return interval;
}

function normalizeRange(g) {
    const moment = require('moment');
    if (g.length < 2) return g; // shortcut case

    let minStart = Number.MAX_SAFE_INTEGER;
    let maxEnd = Number.MIN_SAFE_INTEGER;
    let maxStep = 0;

    g.forEach(t => {
        const start = t.data[0].start;
        const end = t.data[t.data.length-1].start;
        const step = (end - start) / t.data.length;

        minStart = Math.min(minStart, start);
        maxEnd = Math.max(maxEnd, end);
        maxStep = Math.max(maxStep, step);
    });
    console.log(moment(minStart).format('LT'), moment(maxEnd).format('LT'), maxStep);
    return g.map(t => {
        // TODO normalize step size
        const start = t.data[0].start;
        const startPaddingLen = (start - minStart) / maxStep;
        const startPadding = interval(minStart, maxStep, startPaddingLen);

        const end = t.data[t.data.length-1].start;
        const endPaddingLen = (maxEnd - end) / maxStep;
        const endPadding = interval(end, maxStep, endPaddingLen);

        t.data = _.flatten(_.concat(startPadding, t.data, endPadding));
        return t;
    });
}

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

    normalizeRange: normalizeRange,

    apply: apply,
    applyToValues: applyToValues,
 
    compileForGroup: compileForGroup,
    compileForSeries: compileForSeries,
    compileForValues: compileForValues,
}