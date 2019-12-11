const _ = require('lodash');
const Rx = require('rxjs');
const RxOp = require('rxjs/operators');
const cmd = require('../cmd-util');



function parse(ctx, args) {
    const depth = cmd.kvps(args).depth;
    const flattenFn = depth ? (a) => _.flattenDepth(a, depth) : (a) => _.flattenDeep(a);
    return Rx.pipe(
        RxOp.reduce((a,r) => {
            a = a.concat(flattenFn(r));
            return a;
        }, []),
    )
}

module.exports = {
    parse: parse
}