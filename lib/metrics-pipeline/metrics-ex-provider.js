const _ = require('lodash');
const appSvc = require('../app');
const metricsExSvc = require('../metrics-ex');
const glob = require('../glob');

function findApps(client, appPattern) {
    return appSvc(client)
            .fetchAllApps()
            .then(apps => apps.filter(app => glob.matches(appPattern, app.name)));

}
function fetchMetrics(client, app, path, value, range) {
    values = parseValues(value);
    return Promise.all(values.map(v => fetchAndNormalizeMetrics(client, app, range, path, v.value, v.baseline)));
}

function fetchAndNormalizeMetrics(client, app, range, path, value, baseline) {
    return metricsExSvc(client)
        .fetchMetrics(app, path, range, baseline)
        .then(tss => 
            tss.map(ts => createMetric(app.name, ts.node.path, (baseline ? `${value}@${baseline}` : value), ts.range, ts.data.map(d => ({start:d.start, value:d[value]}))))
        );
}
function parseValues(values) {
    values = values || 'value';
    values = values.split(',').map(parseValue);
    return values;
}
function parseValue(value) {
    const parser = /^([^@]+)(?:@(.*))?$/;
    const v = parser.exec(value);
    return {
        value: _.trim(v[1]),
        baseline: _.trim(v[2])
    };
}

function createMetric(app, path, value, range, data) {
    return {
        name: `${app}:|${path.join('|')}[${value}]`,
        app: app,
        path: path,
        value: value,
        range: range,
        data: data
    };
}

module.exports = (client) => ({
    fetchMetrics: (app, path, value, range) => fetchMetrics(client, app, path, value, range),
    findApps: (appPattern) => findApps(client, appPattern)
});