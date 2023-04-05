const appd = require('../../out/metric-providers/appd-metrics-ex-provider');
const env = require('../../../appd-services/test/_env');

const ctx = {
    range: { startTime: 1650461161061, endTime:1650336378053 }
}

test('it works', async () => {
    return env.defaultClient().then(client => {
        const p = new appd.AppDynamicsMetricsProvider(client);
        const search = {
            app: '2942*QA',
            path: ["Overall*", "Calls*"],
            values:[]
        }
        return p.fetchMetrics(ctx, search)
        .then(results => {
            expect(results.length).toBe(1);
            expect(results[0].name).toBe('Calls per Minute');
            expect(results[0].data[0].value).toBeGreaterThan(0);
            return results;
        })
    });
})
