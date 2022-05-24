const interpreter = require('../../out/rt/interpreter');
const env = require('../../../appd-services/test/_env');
const appdProvider = require('../../out/metric-providers/appd-metrics-ex-provider');

function test(name, cb) {
    cb().then(console.log);
}
test('it works', async () => {
    const x = env.defaultClient().then(client => {
        const provider = new appdProvider.AppDynamicsMetricsProvider(client);
        const range =  { startTime: 1650461161061, endTime:1650336378053 };
        return interpreter.exec('2942*QA:/Overall*/Calls* >> scale 10', [provider], range, {})
        .then(results => {
            console.log(results);
            return results;
        })
    })
    console.log(x);
})
