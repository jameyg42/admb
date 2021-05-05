const base = require('./_base');
const _ = require('lodash');
const moment = require('moment');

function intersect(g) {
    if (g.length < 2) return g; // shortcut case

    let maxStart = Number.MIN_SAFE_INTEGER;
    let minEnd = Number.MAX_SAFE_INTEGER;

    g.forEach(t => {
        maxStart = Math.max(maxStart, t.data[0].start);
        minEnd = Math.min(minEnd, t.data[t.data.length-1].start);
    });
    if (maxStart > minEnd) return []; // shortcut case - zero intersect

    return g.map(ts => {
        ts.data = ts.data
            .filter(d => d.start >= maxStart)
            .filter(d => d.start <= minEnd)
        return ts;
    });
}

module.exports = {
    compile: base.compileForGroup('rangeIntersect', (ctx, args) => intersect),
    params: []
}