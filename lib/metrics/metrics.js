const _ = require('lodash');
const _range = require('../range')
const defaultRange = _range.beforeNow(60);

// basic service wrappers around the AppDynamics metrics browse/fetch services
// most people will want to use the metricsEx.js service instead.
module.exports = (client) => {
    const appSvc = require('../app')(client);

    function browseTree(app, path, range) {
        if (!_.isArray(path)) {
            path = path.split("|");
        }
        return client.post('/restui/metricBrowser/async/metric-tree/root', {
            applicationId: app.id || app,
            pathData: path || [],
            timeRangeSpecifier: range || defaultRange
        }).then(nodes => {
            nodes.forEach(n => n.path = path.concat([n.name]));
            return nodes;
        });
    }

    function fetchMetricData(metricNodes, range, baseline) {
        var url = '/restui/metricBrowser/getMetricData';
        var metricQueries = metricNodes
        .filter(n => n.metricId > 0)
        .map(n => ({
            entityType: n.type,
            entityId: n.entityId,
            metricId: n.metricId
        }))
        const args = {
            maxSize: 1088,
            metricDataQueries: metricQueries,
            timeRangeSpecifier: range || defaultRange
        }
        if (baseline) {
            url = '/restui/metricBrowser/getMetricBaselineData?granularityMinutes=1';
            args.metricBaseline = baseline.id ? baseline.id : baseline;
        }
        return client.post(url, args)
        .then(rsp => rsp.map((ts, i) => {
            ts.node = metricNodes[i];
            ts.range = _range.fix(range || defaultRange);
            return ts;
            })
        );
    }

    return {
        browseTree: browseTree,
        fetchMetricData: fetchMetricData
    };
}