const base = require('./_base');
const reducers = require('../../stats/reducers');

function movingAvg(ctx, args) {
    window = args.window || 5;
    return (v, i, a) => {
        const before = Math.min(i, Math.round(window / 2));
        const after = window - before;

        const slice = a.slice(i-before, i+after);
        const avg = slice.map(d => d.value).reduce(reducers.avg);

        return avg;
    };
}

module.exports = {
    compile: base.compileForValues('smooth', movingAvg),
    params: ['window']
}