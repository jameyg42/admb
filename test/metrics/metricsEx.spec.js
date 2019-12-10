const client = require('../it-client');
const metrics = require('../../lib/metrics/metricsEx')(client);
const range = require('../../lib/range');

const itApp = {
    id: 577,
    name: '0000-SANDBOX_HEALTHRULE_TEST'
}

metrics.browse(itApp, 'Overall Application Performance').then(console.log)

metrics.browse(itApp, 'Overall Application Performance|*|Individua? Nodes').then(console.log)

metrics.browse(itApp, 'Overall Application Performance').then(nodes => {
//    console.log(nodes);
    metrics.fetchMetrics(itApp, nodes).then(console.log)
})

metrics.fetchMetrics(itApp, 'Overall Application Performance|Calls per Minute').then(console.log);

metrics.fetchMetrics(itApp, 'Overall Application Performance|*|Calls per Minute', range.beforeNow(60))
.then(ms => console.log(ms[0].data, ms[0].data.length));