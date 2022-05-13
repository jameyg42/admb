import { AppArg, BaselineArg, Metric, MetricData, MetricNode, PathArg } from './types';
import { createHash } from 'crypto';
import { cache } from '@metlife/appd-libutils';
import { Range, defaultRange } from '../range';
import { Client } from '../client';
import { App, AppServices, Baseline } from '../app';

const metricTreeCache = new cache.ReadThroughCache({stdTTL: 10 * 60});
const fixedRangeMetricCache = new cache.ReadThroughCache({stdTTL: 10 * 60});
const relativeRangeMetricCache = new cache.ReadThroughCache({stdTTL: 2 * 60});

function cacheFor(range:Range) {
    return range.type === 'BEFORE_NOW' ? relativeRangeMetricCache : fixedRangeMetricCache;
}

function key(...args:any[]) {
    const key = createHash('md5').update(JSON.stringify(args)).digest('hex');
    return key;
}

// basic service wrappers around the AppDynamics metrics browse/fetch services
// most people will want to use the metricsEx.js service instead.
export class MetricsServices {
    private app:AppServices;
    constructor(private client:Client) {
        this.app = new AppServices(client);
    }
    static create(client:Client|Promise<Client>):Promise<MetricsServices> {
        return client instanceof Client
            ? Promise.resolve(new MetricsServices(client))
            : client.then(c => new MetricsServices(c));
    }

    browseTree(app:AppArg, path:PathArg, range:Range = defaultRange):Promise<MetricNode[]> {
        const pathSegments = Array.isArray(path) ? path : path.split('|');
        const cacheKey = key(this.client.session.url, app, path);
        return metricTreeCache.get(cacheKey, () =>
            this.client.post<MetricNode[]>('/restui/metricBrowser/async/metric-tree/root', {
                applicationId: (app as App).id || app,
                pathData: pathSegments.map((e,i) => i == 3 && e == 'All Other Traffic' ? '_APPDYNAMICS_DEFAULT_TX_' : e),
                timeRangeSpecifier: range
            })
            .then(nodes => {
                nodes.forEach(n => {
                    n.path = pathSegments.concat([n.name]);
                    n.app = app;
                });
                return nodes;
            })
        );
    }

    fetchMetricData(metricNodes:MetricNode[], range:Range = defaultRange, baseline?:BaselineArg):Promise<Metric[]> {
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
        } as any;
        if (baseline) {
            // FIXME granularity
            url = `/restui/metricBrowser/getMetricBaselineData`;
            args.metricBaseline = (baseline as Baseline).id || baseline;
        }

        const cacheKey = key(this.client.session.url, args);
        return cacheFor(range).get(cacheKey, () =>
            this.client.post<any[]>(url, args)
            .then(metrics => metrics
                .map((ts, i) => ({
                    metricId: ts.metricId,
                    metricName: ts.metricName,
                    frequency: ts.frequency,
                    granularityMinutes: ts.granularityMinutes,
                    
                    range: range,
                    node: metricNodes[i],
                    baseline: baseline,

                    data: ts.dataTimeslices.map((dts:any) => {
                        const d = {
                            startTime: dts.startTime
                        } as any;
                        if (baseline) {
                            d.baseline = dts.metricValue.value;
                            d.stddev = dts.metricValue.standardDeviation;
                        }
                        else {
                            for (let p in dts.metricValue) {
                                if (p == 'standardDeviation') continue;
                                d[p] = dts.metricValue[p];
                            }
                        }
                        return d as MetricData;
                    })
                }) as Metric
            ))
        );
    }
}
