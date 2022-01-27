import { isGlob, toRex } from "@metlife/appd-libutils/out/glob";
import { MetricsServices, AppArg, Path, MetricNode, Metric } from '../metrics';
import { App, AppServices, Baseline } from '../app';
import { Client } from "../client";
import { Range, defaultRange } from "../range";
import { PathExArg, PathEx } from "./types";
import { VNodeServices } from "../vnodes";


export class MetricsExServices {
    private app:AppServices;
    private metrics: MetricsServices;
    constructor(private client:Client) {
        this.app = new AppServices(client);
        this.metrics = new MetricsServices(client);
        VNodeServices.extend(this.metrics);
    }
    static create(client:Client|Promise<Client>):Promise<MetricsExServices> {
        return client instanceof Client
            ? Promise.resolve(new MetricsExServices(client))
            : client.then(c => new MetricsExServices(c));
    }
    browse(app:AppArg, path:PathExArg, range:Range = defaultRange):Promise<MetricNode[]> {
        const metricPath = parsePath(path);
        const metricApp = asApp(app);

        const _findPathsMatching = (path:Path, nodesMatching:(RegExp|string)):Promise<Path[]> => {
            if (!(nodesMatching as RegExp).test) { // not a regex, just append it
                return Promise.resolve([path.concat(nodesMatching as string)]);
            }
            return this.metrics.browseTree(metricApp, path, range)
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
                    .all(parents.map(p => this.metrics.browseTree(metricApp, p, range)))
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

    /**
     * @param app 
     * @param metricNodesOrPath 
     * @param range 
     * @param baseline 
     * @returns 
     */
    fetchMetrics(app:AppArg, metricNodesOrPath:MetricNode[]|PathExArg, range:Range = defaultRange, baseline?:Baseline):Promise<Metric[]> {
        // NOTE that we no longer support fetching ONLY baseline metrics since the rarity of that case
        // didn't warrant the additional complexity
        if (Array.isArray(metricNodesOrPath) && metricNodesOrPath.length <= 1) {
            return Promise.resolve([]);
        }

        const nodes$ = isArrayOfMetricNodes(metricNodesOrPath) 
            ? Promise.resolve(metricNodesOrPath as MetricNode[]) 
            : (() => {
                const path = parsePath(metricNodesOrPath as PathExArg);
                if (path.length == 0) {
                    return Promise.resolve([]);
                }
                const last = path.pop();
                return this.browse(app, path, range)
                .then(nodes => 
                    nodes.filter(n => last instanceof RegExp ? last.test(n.name) : n.name == last)
                )
            })()
        return nodes$.then(nodes => {
            const metrics$ = [this.metrics.fetchMetricData(nodes, range)];
            if (baseline) {
                metrics$.push(this.metrics.fetchMetricData(nodes, range, baseline));
            }

            return Promise.all(metrics$)
            .then(([metrics,baselines]) => {
                if (baselines) {
                    // merge baseline metrics into normal metrics
                    metrics.forEach(m => {
                        baselines.forEach(b => {
                            if (m.metricId == b.metricId) {
                                m.data.forEach((md, i) => {
                                    md.stddev = b.data[i].stddev;
                                    md.baseline = b.data[i].baseline;
                                })
                            }
                        })
                    })
                }
                return metrics;
            })
        });
    }

}

function parsePath(pathArg:PathExArg): PathEx {
    const path = Array.isArray(pathArg) ? pathArg : (pathArg || '').split('|')
    return path.map(p => p instanceof RegExp ? p : (isGlob(p) ?  toRex(p) : p));
}
function asApp(appArg:AppArg):App {
    return (appArg as App).id ? appArg as App : ({
        id: appArg as number,
    });
}

function isArrayOfMetricNodes(t:MetricNode[]|PathExArg) {
    return Array.isArray(t) && (t[0] as MetricNode)?.metricId;
}
