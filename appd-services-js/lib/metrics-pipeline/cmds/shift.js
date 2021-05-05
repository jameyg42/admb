const base = require('./_base');
const duration = require('parse-duration');

function shift(ctx, args) {
    const dir = args.backward ? -1 : 1;
    const dist = args.forward || args.backward || '5m';

    const distInMillis = duration(dist) * dir;

    return (ts) => {
        ts.name = `${ts.name} (shifted ${dist})`;
        ts.data.forEach(d => d.start += distInMillis);
        return ts;
    }
}

module.exports = {
    compile: base.compileForSeries(shift),
    params: ['forward', 'backward']
}