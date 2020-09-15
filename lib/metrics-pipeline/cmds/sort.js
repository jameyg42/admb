const _ = require('lodash');
const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const base = require('./_base');
const reducers = require('../../stats/reducers');

function direction(dir, a, b) {
    return dir == 'asc' ? [a,b] : [b,a];
}
function rex(r, s) {
    if (!r) {
        return s;
    }
    const m = new RegExp(r).exec(s);
    return m.length > 1 ? m.slice(1).join() : m;
}
const opMap = {
    avg: (args, dir) => (a, b) => {
        [a,b] = direction(dir, a, b);
        return a.data.map(d => d.value).reduce(reducers.avg) - b.data.map(d => d.value).reduce(reducers.avg);
    },
    name: (args, dir) => (a,b) => {
        [a,b] = direction(dir, a, b);
        const ap = rex(args, a.name);
        const bp = rex(args, b.name);
        return ap.localeCompare(bp);
    },
    segment: (args, dir) => (a,b) => {
        [a,b] = direction(dir, a, b);
        const ap = a.path[args-1] || a.name;
        const bp = b.path[args-1] || b.name;
        return ap.localeCompare(bp);
    }
}

function compile(ctx, args) {
    const by = args.by || 'name';

    const parsed = /(\w+)(?:\[(\w+)\])?(?:\((\w+)\))?/.exec(by);
    const sortBy = parsed[1];
    const sortByArgs = parsed[2];

    const dir = args.dir || (sortBy === 'avg' ? 'desc' : 'asc');

    const op = opMap[sortBy](sortByArgs, dir);

    function sortGroups(gs) {
        // first, sort the members of the groups
        const groups = base.forEachGroup(sortGroupMembers, ...gs);

        // next, sort the groups by comparing the first member of each group
        // NOTE that we're relying here on array sorting being done "in place"
        function _sortGroup(gs) {
            if (_.isArray(gs[0][0])) {
                gs.forEach(_sortGroups);
            } else {
                gs.sort((a,b) => {
                    const a1 = a[0];
                    const b1 = b[0];
                    return op(a1,b1);
                });
            }
        }
        _sortGroup(groups);
        return groups;

    }
    function sortGroupMembers(g) {
        const sorted = g.slice().sort(op);
        return sorted;
    }

    return Rx.pipe(
        RxOp.map(sortGroups)
    )
}

module.exports = {
    compile: compile,
    params: ['by', 'dir']
}