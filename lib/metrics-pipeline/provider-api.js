// currently just documentation for the expected pipeline provider API
function fetchMetrics(app, path, value, range) {}
function findApps(app) {}

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

module.exports = {
    fetchMetrics: fetchMetrics,
    findApps: findApps,
    createMetric: createMetric
};