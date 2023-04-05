const metrics = require('../out/metrics');
const env = require('dotenv');

const DBMON = {id:1};
// onprem DBMON is always present w/ AppId=1 so use that
// SaaS DBMON AppId varies so be on the lookout!
test('browse DBMON metrics root', async () => {
    return env.defaultClient().then(client => {
        const m = new metrics.MetricsServices(client);
        return m.browseTree(DBMON).then(dbs => {
            expect(dbs.length).toBe(2); // Databases, DB Agents
        });
    })
})
test('fetch DBMON KPI', async () => {
    return env.defaultClient().then(client => {
        const m = new metrics.MetricsServices(client);
        return m.browseTree(DBMON, ['Databases'])
        .then(dbs =>
            m.browseTree(DBMON, ['Databases', dbs[dbs.length-1].name, 'KPI'])
        )
        .then(kpiNodes =>
            m.fetchMetricData(kpiNodes) 
        )
        .then(kpis => {
            expect(kpis.length).toBe(4);
            return kpis;
        })
    })
})
