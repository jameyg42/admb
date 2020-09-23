const _ = require('lodash');
const appSvc = require('../app');
const metricsExSvc = require('../metrics-ex');
const glob = require('../glob');

function fetchMetrics(client, ctx, path) {
    return findApps(client, path.app)
        .then(apps => Promise.all(
            apps.map(app => fetchMetricsForApp(client, ctx, app, path))
        ))
        .then(tss => _.flattenDeep(tss))
}

function findApps(client, appPattern) {
    return appSvc(client)
            .fetchAllApps()
            .then(apps => apps.filter(app => glob.matches(appPattern, app.name)));
}
function fetchMetricsForApp(client, ctx, app, path) {
    values = parseValues(path.values);
    return Promise.all(values.map(v => fetchAndNormalizeMetrics(client, ctx, app, path, v)));
}

function fetchAndNormalizeMetrics(client, ctx, app, path, value) {
    const pathParts = path.path.split(path.delim);
    return metricsExSvc(client)
        .fetchMetrics(app, pathParts, ctx.defaultRange, value.baseline)
        .then(tss => 
            tss.map(ts => createMetric(
                app.name, 
                ts.node.path, 
                (value.baseline ? `${value.value}@${value.baseline}` : value.value), 
                ts.range, 
                ts.data.map(d => ({start:d.start, value:d[value.value]})))
            )
        )
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
    fetchMetrics: (ctx, path) => fetchMetrics(client, ctx, path)
});