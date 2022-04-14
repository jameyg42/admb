const _ = require('lodash');
const moment = require('moment');

const _range = require('../range')
const defaultRange = _range.beforeNow(60);

const crypto = require('crypto');
const Cache = require('node-cache');
const metricTreeCache = new Cache({stdTTL: 10 * 60});
const fixedRangeMetricCache = new Cache({stdTTL: 10 * 60});
const relativeRangeMetricCache = new Cache({stdTTL: 2 * 60});
function cacheFor(range) {
    return range.type === 'BEFORE_NOW' ? relativeRangeMetricCache : fixedRangeMetricCache;
}

function key() {
    const args = JSON.stringify(arguments);
    const key = crypto.createHash('md5').update(args).digest('hex');
    return key;
}

// basic service wrappers around the AppDynamics metrics browse/fetch services
// most people will want to use the metricsEx.js service instead.
module.exports = (client) => {
    const appSvc = require('../app')(client);

    function browseTree(app, path, range) {
        if (!_.isArray(path)) {
            path = path === '' ? [] : path.split("|");
        }
        const cacheKey = key(client.session.baseURL, app, path);
        const cached = metricTreeCache.get(cacheKey);
        if (cached) {
            return Promise.resolve(_.cloneDeep(cached));
        }
        return client.post('/restui/metricBrowser/async/metric-tree/root', {
            applicationId: app.id || app,
            pathData: path ? path.map((e,i) => i == 3 && e == 'All Other Traffic' ? '_APPDYNAMICS_DEFAULT_TX_' : e) : [],
            timeRangeSpecifier: range || defaultRange
        }).then(nodes => {
            nodes.forEach(n => {
                n.path = path.concat([n.name]);
                n.app = app;
            });
            metricTreeCache.set(cacheKey, _.cloneDeep(nodes));
            return nodes;
        });
    }

    function fetchMetricData(metricNodes, range, baseline) {
        range = range || defaultRange;
        var url = '/restui/metricBrowser/getMetricData';
        var metricQueries = metricNodes
        .filter(n => n.metricId > 0)
        .map(n => ({
            entityType: n.type,
            entityId: n.entityId,
            metricId: n.metricId
        }));
        if (metricQueries.length == 0) {
            return Promise.resolve([]);
        }
        const args = {
            maxSize: 1088,
            metricDataQueries: metricQueries,
            timeRangeSpecifier: range
        }
        if (baseline) {
            let granularity = 60;
            const start = moment(_range.fix(range).startTime);
            const diff = moment().diff(start, 'hours');
            if (diff <= 4) {
                granularity = 1
            } else if (diff <= 48) {
                granularity = 10;
            }
            url = `/restui/metricBrowser/getMetricBaselineData?granularityMinutes=${granularity}`;
            args.metricBaseline = baseline.id ? baseline.id : baseline;
        }

        const cacheKey = key(client.session.baseURL, args);
        const cached = cacheFor(range).get(cacheKey);
        if (cached) {
            return Promise.resolve(_.cloneDeep(cached));
        }
        return client.post(url, args)
        .then(rsp => {
            const mrsp = rsp.map((ts, i) => {
                ts.node = metricNodes[i];
                ts.range = _range.fix(range || defaultRange);
                return ts;
            });
            cacheFor(range).set(cacheKey, _.cloneDeep(mrsp));
            return mrsp;
        });
    }

    return {
        browseTree: browseTree,
        fetchMetricData: fetchMetricData
    };
}