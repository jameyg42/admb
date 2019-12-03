const defaultRange = require('./range').beforeNow(60);

function globToRegEx(str) {
    return new RegExp('^'+
        str
        .replace(/[*]/g, '.*')
        .replace(/[?]/g, '.')
        .replace(/{([^}]+)}/, (m,p1) => `(${p1.replace(',','|')})`)
    ) 
}
function isGlob(str) {
    return /[*?]|{[^}]+}|\[[^*?]+\]/.test(str);
}
function parsePath(path) {
    if (!Array.isArray(path)) {
        path = path.split('|');
    }

    path = path.map(p => p.test ?  p : (isGlob(p) ?  globToRegEx(p) : p))
    return path;
}


module.exports = (client) => {
    const appSvc = require('./app')(client);

    function browse(app, metricPath, range) {
        range = range || defaultRange;
        metricPath = parsePath(metricPath);
        return _findNodesMatchingDeep([[]], metricPath);

        function _findNodes(path) {
            return client.post('/restui/metricBrowser/async/metric-tree/root', {
                applicationId: app.id,
                pathData: path || [],
                timeRangeSpecifier: range
            }).then(nodes => {
                nodes.forEach(n => n.path = path.concat([n.name]));
                return nodes;
            })
        }
        function _findPathsMatching(path, nodesMatching) {
            if (!nodesMatching.test) { // not a regex, just append it
                return [path.concat(nodesMatching)];
            }
            return _findNodes(path)
                .then(nodes => nodes
                    .filter(n => n.metricId === 0) // we're searching for paths here, not nodes
                    .filter(n => nodesMatching.test(n.name))
                    .map(n => path.concat(n.name)
                )
            );
        }
        function _findNodesMatchingDeep(parents, remaining) {
            if (remaining.length === 0) {
                return Promise
                    .all(parents.map(p => _findNodes(p)))
                    .then(nodes => {
                        return nodes
                        .reduce((a,c) => a.concat(c), [])
                    });
            } else {
                const n = remaining.shift();
                return Promise
                    .all(parents.map(p => _findPathsMatching(p, n)))
                    .then(paths => paths.reduce((a,c) => a.concat(c), []))
                    .then(paths => _findNodesMatchingDeep(paths, remaining))
            }
        }
    }

    function _findMetrics(app, metricNodesOrPath, range) {
        if (Array.isArray(metricNodesOrPath) && metricNodesOrPath.length > 0 && metricNodesOrPath[0].metricId) {
            return Promise.resolve(metricNodesOrPath);
        }

        const path = parsePath(metricNodesOrPath);
        const metricsToFind = path.pop();

        return browse(app, path, range)
        .then(nodes => 
            nodes.filter(n => metricsToFind.test ? metricsToFind.test(n.name) : n.name === metricsToFind)
        );
    }
    function _fetchMetrics(url, app, metricNodesOrPath, range, baseline) {
        range = range || defaultRange;
        return _findMetrics(app, metricNodesOrPath, range)
        .then(metricNodes => {
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
                timeRangeSpecifier: range
            }
            if (baseline) {
                args.metricBaseline = baseline.id ? baseline.id : baseline;
            }
            return client.post(url, args)
                .then(rsp => rsp.map((ts, i) => {
                        ts.node = metricNodes[i];
                        return ts;
                    })
                )
        });
    }
    function fetchMetrics(app, metricNodesOrPath, range) {
        return _fetchMetrics('/restui/metricBrowser/getMetricData', app, metricNodesOrPath, range);
    }
    function fetchBaselineMetrics(app, metricNodesOrPath, range, baseline) {
        return new Promise(resolve => {
            if (baseline === 'DEFAULT' || baseline === undefined ) {
                appSvc.fetchDefaultBaseline(app).then(resolve);
            } else {
                resolve(baseline)
            }
        }).then(bl => {
            return _fetchMetrics('/restui/metricBrowser/getMetricBaselineData?granularityMinutes=1', app, metricNodesOrPath, range, bl);
        })
    }

    return {
        browse: browse,
        fetchMetrics: fetchMetrics,
        fetchBaselineMetrics: fetchBaselineMetrics,
    }

    
}
