const metrics = require('../out/metrics-ex')
const env = require('dotenv');
const beforeNow = require('../out/range').beforeNow;

test('browse single root node', async() => {
    return env.defaultClient().then(client => {
        const svc = new metrics.MetricsExServices(client);
        return svc.browse(env.onprem.app, "Overall*")
        .then(nodes => {
        })
    })
})

test('fetch metrics', async () => {
    return env.defaultClient().then(client => {
        const svc = new metrics.MetricsExServices(client);
        return svc.fetchMetrics(env.onprem.app, "Overall*|Calls*", beforeNow(2 * 30 * 24 * 60))
        .then(nodes => {
            console.log(nodes);
        })
    })

})
