const _ = require('lodash');

function kvps(args) {
    const kvps = {};
    // cute use of replace() for execAll-like funtionality
    args.replace(/\s*(?:(\S+)\s*=\s*(\"[^\"]*\"|\S*))/g, (kvp, k, v) => {
        kvps[k] = /^"*(.*?)"*$/.exec(v)[1];
    });
    return kvps;
}

function forEachGroup(fn, ...ts) {
    const results = [];
    function _forEachGroup(fn, results, ts) {
        if (ts[0] && _.isArray(ts[0])) {
            for (const t of ts) {
                _forEachGroup(fn, results, t);
            }
        } else {
            const r = fn(ts);
            results.push(_.isArray(r) ? r : [r]);
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
            gs.push(fn(ts));
        }
    }
    _deep(fn, groups, ts);
    return groups;
}

module.exports = {
    kvps: kvps,
    forEachGroup: forEachGroup,
    forEachSeries: forEachSeries
}