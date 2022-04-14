const _ = require('lodash');
const normalize = require('./normalize');
const glob = require('../glob');
const vnodes = require('./metrics-vnodes').vnodes;
const defaultRange = require('../range').beforeNow(60);




function parsePath(path) {
    if (!Array.isArray(path)) {
        path = path == null || path == '' ? [] : path.split('|');
    }

    path = path.map(p => p.test ?  p : (glob.isGlob(p) ?  glob.toRex(p) : p))
    return path;
}


module.exports = (client) => {
    const metricSvc = require('../metrics')(client);
    const appSvc = require('../app')(client);

    function browse(app, metricPath, range) {
        range = range || defaultRange;
        metricPath = parsePath(metricPath);
        return _findNodesMatchingDeep([[]], metricPath)
            .then(r => r.sort((a,b) => a.name.localeCompare(b.name)))
        ;

        function _findNodes(path) {
            return Promise.all([
                metricSvc.browseTree(app, path, range),
                _findVnodes(path)
            ]).then(_.flattenDeep)
        }
        function _findVnodes(path) {
            return vnodes(client, app, path, range)
                .then(vns => Promise.all(
                    vns.map(vn => {
                        if(vn.mapping) {
                            return metricSvc.browseTree(vn.mapping.app, vn.mapping.path, range)
                                .then(ns => ns.map(n => {
                                    n.path = path.concat(n.path.slice(-1));
                                    return n;
                                }))
                        }
                        return vn;
                    })
                ));
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
    function _fetchMetrics(app, metricNodesOrPath, range, baseline) {
        range = range || defaultRange;
        return _findMetrics(app, metricNodesOrPath, range)
        .then(metricNodes => metricSvc.fetchMetricData(metricNodes, range, baseline))
        .then(metrics => metrics.map(ts => normalize(ts)))
        ;
    }
    function fetchMetrics(app, metricNodesOrPath, range, baseline) {
        return Promise.all([
            _fetchMetrics(app, metricNodesOrPath, range),
            (baseline ? fetchBaselineMetrics(app, metricNodesOrPath, range, baseline) : Promise.resolve([]))
        ]).then(([ms, blms]) => {
            // merge them metrics and baseline metrics into a single set
            blms.forEach(blm => {
                ms.filter(m => m.metricFullName === blm.metricFullName)
                  .forEach(m => {
                    m.data.forEach((d, i) => {
                        const bld = blm.data[i] || {};
                        d.stddev = bld.stddev;
                        d.baseline = bld.value;
                    });
                  });
            });
            return ms;
        });
    }
    function fetchBaselineMetrics(app, metricNodesOrPath, range, baseline) {
        return new Promise(resolve => {
            if (_.isString(baseline)) {
                appSvc.findBaseline(app, baseline).then(resolve);
            } else {
                resolve(baseline)
            }
        }).then(bl => {
            return _fetchMetrics(app, metricNodesOrPath, range, bl);
        })
    }

    return {
        browse: browse,
        fetchMetrics: fetchMetrics,
        fetchBaselineMetrics: fetchBaselineMetrics,
    }
}