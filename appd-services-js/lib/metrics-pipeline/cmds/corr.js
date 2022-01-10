const base = require('./_base');
const _ = require('lodash');
const corr = require('../../stats/corr');

function correlateFactoryFn(ctx, args) {
    const window = args.window;
    return (g) => {
        const results = [];
        g = base.normalizeRange(g);
        if (g.length > 1) {
            // correlate each member of the group with each other
            for (let i = 0; i < g.length - 1; i++) {
                for (let j = i+1; j < g.length; j++) {
                    results.push(correlateSeries(g[i], g[j], window));
                }
            }
        } else {
            const tsX = g[0];
            const tsY = g[1] || tsX;
            results.push(correlateSeries(tsX, tsY, window));
        }
        return results;
    }
}

function correlateSeries(tsX, tsY, window) {
    const result = _.clone(tsX);
    result.name = `corr(${tsX.name},${tsY.name})`;

    const X = tsX.data.map(d => d.value);
    const Y = tsY.data.map(d => d.value);
    const size = parseInt(window || X.length);

    const ccs =  _.flatten(
                        correlateChunks(X, Y, size)
                        .map(cs => _.fill(Array(size), cs))
                );
    base.applyToValues((v, i) => ccs[i])(result);
    return result;
}

function correlateChunks(X, Y, size) {
    cX = _.chunk(X, size);
    cY = _.chunk(Y, size);

    return _.zip(cX, cY)
            .map(([a, b]) => corr.pearson(a, b));
        
}

module.exports = {
    compile: base.compileForGroup('corr', correlateFactoryFn),
    params: ['window']
}
