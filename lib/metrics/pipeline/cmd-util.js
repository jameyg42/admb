const _ = require('lodash');

function forEachGroup(fn, ...ts) {
    const results = [];
    function _forEachGroup(fn, results, ts) {
        if (ts[0] && _.isArray(ts[0])) {
            for (const t of ts) {
                _forEachGroup(fn, results, t);
            }
        } else {
            const r = fn(ts);
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

module.exports = {
    forEachGroup: forEachGroup,
    forEachSeries: forEachSeries,
    toArray: toArray
}