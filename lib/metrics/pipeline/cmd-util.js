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
            results.push(fn(ts));
        }
    }
    _forEachGroup(fn, results, ts);
    return results;
}

module.exports = {
    kvps: kvps,
    forEachGroup: forEachGroup
}