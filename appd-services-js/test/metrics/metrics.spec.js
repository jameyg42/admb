const client = require('../it-client');
const metrics = require('../../lib/metrics')(client);

const itApp = {
    id: 130,
    name: '2942-IBSE_QA'
}

metrics.browseTree(itApp, 'Overall Application Performance')
.then(console.log)
.catch(console.log)


metrics.browseTree(itApp, 'Overall Application Performance')
.then(nodes => {
    nodes = nodes.filter(n => n.name=='Calls per Minute');
    metrics.fetchMetricData(nodes).then(console.log);
}).catch(console.log)
