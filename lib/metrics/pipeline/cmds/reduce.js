const _ = require('lodash');
const cmd = require('../cmd-util');
const reduce = require('../../ts/reduce').reduce;
const reducers = require('@metlife/lib-stats/lib/reducers');
const Rx = require('rxjs');
const RxOp = require('rxjs/operators');

function parse(ctx, args) {
    const fn = cmd.kvps(args).fn;
    if (!fn) {
        throw `no reduce function specified for args '${args}'`;
    }
    const reducer = reducers[fn];
    if (!reducer) {
        throw `invalid reducer function '${fn}'`
    }

    return Rx.pipe(
 //       RxOp.tap(r => console.trace),
        RxOp.map(r => {
            return cmd.forEachGroup((g) => reduce(fn, ...g), ...r);
        })
    )
}

module.exports = {
    parse: parse
}