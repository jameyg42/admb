const _ = require('lodash');
const base = require('./_base');

module.exports = {
    compile: base.compileForGroup((ctx,args) => (g) => {
        // use the first member of the group to figure out the "width" of the series
        if (g.length == 0) return g;
        
        const value = args.value || 0;
        const first = g[0];
        const threshold = {
            name: args.name || 'threshold',
            app: 'n/a',
            path: [],
            range: first.range,
            data: _.cloneDeep(first.data)
        };
        threshold.data.forEach(d => d.value = value);
        g.push(threshold);

        return g;
    }),
    params: ['value', 'name']
}