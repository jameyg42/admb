import { isGlob, toRex } from "@metlife/appd-libutils/out/glob";
import { MetricsServices, Path, MetricNode } from '../metrics';
import { App, Baseline } from '../app';
import { Client } from "../client";
import { Range, defaultRange } from "../range";
import { PathExArg, PathEx, MetricEx, BaselineData } from "./types";
import { VNodeServices } from "../vnodes";
import { Metric } from "../metrics/types";


export class MetricsExServices {
    private metrics: MetricsServices;
    constructor(private client:Client) {
        this.metrics = new MetricsServices(client);
        VNodeServices.extend(this.metrics);
    }
    static create(client:Client|Promise<Client>):Promise<MetricsExServices> {
        return client instanceof Client
            ? Promise.resolve(new MetricsExServices(client))
            : client.then(c => new MetricsExServices(c));
    }
    browse(app:App, path:PathExArg, range:Range = defaultRange):Promise<MetricNode[]> {
        const metricPath = parsePath(path);

        const _findPathsMatching = (path:Path, nodesMatching:(RegExp|string)):Promise<Path[]> => {
            if (!(nodesMatching as RegExp).test) { // not a regex, just append it
                return Promise.resolve([path.concat(nodesMatching as string)]);
            }
            return this.metrics.browseTree(app, path, range)
                .then(nodes => nodes
                    .filter(n => n.metricId === 0) // we're searching for paths here, not nodes
                    .filter(n => (nodesMatching as RegExp).test(n.name))
                    .map(n => path.concat(n.name)
                )
            );
        }
        const _findNodesMatchingDeep = (parents:Path[], remaining:PathEx):Promise<MetricNode[]> => {
            if (remaining.length === 0) {
                return Promise
                    .all(parents.map(p => this.metrics.browseTree(app, p, range)))
                    .then(nodes => {
                        return nodes
                        .reduce((a,c) => a.concat(c), [])
                    });
            } else {
                const n = remaining.shift();
                return Promise
                        .all(parents.map(p => _findPathsMatching(p, n as string|RegExp)))
                        .then(paths => paths.reduce((a,c) => a.concat(c), []))
                        .then(paths => _findNodesMatchingDeep(paths, remaining))
            }
        }
        return _findNodesMatchingDeep([[]], metricPath)
            .then(r => r.sort((a,b) => a.name.localeCompare(b.name)))
        ;
    }

    fetchMetrics(app:App, path:PathExArg, range:Range = defaultRange, ...baseline:Baseline[]):Promise<MetricEx[]> {
        const metricPath = parsePath(path as PathExArg);
        if (metricPath.length == 0) {
            return Promise.resolve([]);
        }
        const last = metricPath.pop();
        return this.browse(app, metricPath, range)
        .then(nodes => 
            nodes.filter(n => last instanceof RegExp ? last.test(n.name) : n.name == last)
        )
        .then(nodes => this.fetchMetricsForNodes(nodes, range, ...baseline));
    }
    /**
     * NOTE that if fetching baseline metrics, the metrics should all be from the same App used to
     * lookup the Baseline.  Results will be unpredictable otherwise.
     * @param metricNodes 
     * @param range 
     * @param baseline 
     * @returns 
     */
    fetchMetricsForNodes(metricNodes:MetricNode[], range:Range = defaultRange, ...baselines:Baseline[]): Promise<MetricEx[]> {
        // NOTE that we no longer support fetching ONLY baseline metrics since the rarity of that case
        // didn't warrant the additional complexity.
        // Also, different controllers can produce results with different granularities for the same
        // range, so we cannot easily predict what the granularity argument should be for the baselineMetrics
        // call.  AppDynamics solves this itself by first fetching normal metrics and using the granularity
        // on that response as the input to baselineMetrics - we'll copy that here.
        if (metricNodes.length == 0) {
            return Promise.resolve([]);
        }

        return this.metrics.fetchMetricData(metricNodes, range)
        .then(baseMetrics => baseMetrics.map(metricToMetricEx))
        .then(metrics => {
            if (baselines.length == 0) {
                return metrics;
            }
            const granularity = metrics[0].precision;
            return Promise.all(
                baselines.map(bl => this.metrics.fetchMetricBaselineData(metricNodes, range, bl, granularity))
            )
            .then(baselineMetrics => {
                metrics.forEach((m, mi) => {
                    m.baselineData = baselines.map((b, bi) => ({
                        baseline: b,
                        data: baselineMetrics[bi][mi].data
                    } as BaselineData))
                });
                return metrics;
            })
        });
    }

}

function parsePath(pathArg:PathExArg): PathEx {
    const path = Array.isArray(pathArg) ? pathArg : (pathArg || '').split('|')
    return path.map(p => p instanceof RegExp ? p : (isGlob(p) ?  toRex(p) : p));
}

function metricToMetricEx(metric:Metric):MetricEx {
    return {
        name: metric.metricName,
        fullName: metric.node.path.join('|'),
        node: metric.node,
        range: metric.range,
        precision: metric.granularityMinutes,
        data: metric.data
    } as MetricEx;
}
