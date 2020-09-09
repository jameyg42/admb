const client = require('../it-client');
const metrics = require('../../lib/metrics')(client);

const itApp = {
    id: 577,
    name: '0000-SANDBOX_HEALTHRULE_TEST'
}

metrics.browseTree(itApp, 'Overall Application Performance')
.then(console.log)
.catch(console.log)


metrics.browseTree(itApp, 'Overall Application Performance')
.then(nodes => {
    nodes = nodes.filter(n => n.name=='Calls per Minute');
    metrics.fetchMetricData(nodes).then(console.log);
}).catch(console.log)
