const client = require('../it-client');
const metrics = require('../../lib/metrics-ex')(client);
const range = require('../../lib/range');

const itApp = {
    id: 130,
    name: '2942-IBSE_QA'
}

//metrics.browse(itApp, '').then(console.log)
metrics.browse(itApp, 'Servers|ustry1base0088l|CPU').then(console.log);
//metrics.browse(itApp, 'Databases|ESEQ.METLIFE.COM-Oracle DB-USCKU1METE0183L.metnet.net-Oracle*').then(console.log)
//metrics.browse(itApp, 'Overall Application Performance').then(console.log)

//metrics.browse(itApp, 'Overall Application Performance|*|Individua? Nodes').then(console.log)


// metrics.browse(itApp, 'Overall Application Performance').then(nodes => {
// //    console.log(nodes);
//     metrics.fetchMetrics(itApp, nodes).then(console.log)
// })

//metrics.fetchMetrics(itApp, 'Overall Application Performance|Calls per Minute').then(console.log);

// metrics.fetchMetrics(itApp, 'Overall Application Performance|Calls per Minute', range.beforeNow(60))
// .then(ms => console.log(ms[0].data, ms[0].data.length));

// metrics.fetchBaselineMetrics(itApp, 'Overall Application Performance|Calls per Minute', range.beforeNow(60), 'DEFAULT')
// .then(ms => console.log(ms[0].data, ms[0].data.length));

// metrics.fetchMetrics(itApp, 'Overall Application Performance|IBSE*|Calls per Minute')
// .then(ms => console.log(ms[0].data, ms[0].data.length));
