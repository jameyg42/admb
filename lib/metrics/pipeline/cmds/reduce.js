const _ = require('lodash');
const cmd = require('../cmd-util');
const reduce = require('../../ts/reduce').reduce;
const reducers = require('../../../stats/reducers');
const Rx = require('rxjs');
const RxOp = require('rxjs/operators');

function compile(ctx, args) {
    const fn = args.fn;
    if (!fn) {
        throw `no reduce function specified for args '${args}'`;
    }
    const reducer = reducers[fn];
    if (!reducer) {
        throw `invalid reducer function '${fn}'`
    }

    return Rx.pipe(
        RxOp.map(r => {
            return cmd.forEachGroup((g) =>  reduce(fn, ...g), ...r) ;
        })
    )
}

module.exports = {
    compile: compile,
    params: ['fn']
}