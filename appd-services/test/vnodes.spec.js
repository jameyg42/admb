const vnodes = require('../out/vnodes');
const metrics = require('../out/metrics');
const env = require('./_env');

test('can browse root', async () => {
    expect.assertions(1);
    return env.defaultClient().then(client => {
        const svc = new vnodes.VNodeServices(client);
        return svc.browseTree(env.onprem.app, []).then(nodes => {
            expect(nodes.length).toBe(3)
        })
    });
});

test('servers node finds server metrics', async () => {
    expect.assertions(1);
    return env.defaultClient().then(client => {
        const svc = new vnodes.VNodeServices(client);
        return svc.browseTree(env.onprem.app, ['Servers']).then(nodes => 
          svc.browseTree(env.onprem.app, ['Servers', nodes[0].name, 'Hardware Resources', 'CPU'])
        )
        .then(cpuMetrics => {
            expect(cpuMetrics.length).toBe(3);
        })

    });
});
test('can extend MetricsService', async () => {
    expect.assertions(3);
    return env.defaultClient().then(client => {
        const ms = new metrics.MetricsServices(client);
        vnodes.VNodeServices.extend(ms);
        return ms.browseTree(env.onprem.app, [])
        .then(nodes => {
            const names = nodes.map(n => n.name);
            expect(names.length).toBeGreaterThan(3);
            expect(names).toContain('Servers');
        })
        .then(() => {
            return ms.browseTree(env.onprem.app, ['Servers'])
            .then(nodes => {
                expect(nodes.length).toBeGreaterThan(0);
            })
        })
    });
})
