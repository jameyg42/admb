import { Metric, MetricData, MetricNode, PathArg } from './types';
import { createHash } from 'crypto';
import { cache } from '@metlife/appd-libutils';
import { Range, defaultRange } from '../range';
import { Client } from '../client';
import { App, Baseline } from '../app';

const metricTreeCache = new cache.ReadThroughCache({stdTTL: 10 * 60});
const fixedRangeMetricCache = new cache.ReadThroughCache({stdTTL: 10 * 60});
const relativeRangeMetricCache = new cache.ReadThroughCache({stdTTL: 1 * 60});

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
    constructor(private client:Client) {}

    static create(client:Client|Promise<Client>):Promise<MetricsServices> {
        return client instanceof Client
            ? Promise.resolve(new MetricsServices(client))
            : client.then(c => new MetricsServices(c));
    }

    browseTree(app:App, path:PathArg = [], range:Range = defaultRange):Promise<MetricNode[]> {
        const pathSegments = Array.isArray(path) ? path : path.split('|');
        const cacheKey = key(this.client.session.url, arguments);
        return metricTreeCache.get(cacheKey, () =>
            this.client.post<MetricNode[]>('/restui/metricBrowser/async/metric-tree/root', {
                applicationId: app.id,
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

    fetchMetricData(metricNodes:MetricNode[], range:Range = defaultRange):Promise<Metric[]> {
        if (metricNodes.length == 0) {
            return Promise.resolve([]);
        }
        const query = this.createMetricQuery(metricNodes, range);

        const cacheKey = key(this.client.session.url, query);
        return cacheFor(range).get(cacheKey, () =>
            this.client.post<any[]>('/restui/metricBrowser/getMetricData', query)
            .then(metrics => metrics.map((ts,i) => this.translateResponse(ts, metricNodes[i], range)))
        );
    }
    fetchMetricBaselineData(metricNodes:MetricNode[], range:Range, baseline:Baseline, granularity:number):Promise<Metric[]> {
        if (metricNodes.length == 0) {
            return Promise.resolve([]);
        }
        const query = this.createMetricQuery(metricNodes, range);
        query.metricBaseline = baseline.id;

        const cacheKey = key(this.client.session.url, query);
        return cacheFor(range).get(cacheKey, () =>
            this.client.post<any[]>(`/restui/metricBrowser/getMetricBaselineData?granularityMinutes=${granularity}`, query)
            .then(metrics => metrics.map((ts,i) => this.translateResponse(ts, metricNodes[i], range)))
            .then(metrics => {
                metrics.forEach(m => m.baseline = baseline);
                return metrics;
            })
        );
    }

    createMetricQuery(nodes:MetricNode[], range:Range) {
        const queries = nodes
            .filter(n => n.metricId > 0)
            .map(n => ({
                entityType: n.type,
                entityId: n.entityId,
                metricId: n.metricId
            }));
        return {
            maxSize: 240,
            metricDataQueries: queries,
            timeRangeSpecifier: range
        } as any;
    }
    /**
     * translates a getMetricData response into a Metric instance.
     * 
     * @param ts
     * @param node 
     * @param range 
     * @returns 
     */
    translateResponse(ts:any, node:MetricNode, range:Range ):Metric {
        const metric = {
            metricId: ts.metricId,
            metricName: ts.metricName,
            granularityMinutes: ts.granularityMinutes,
            range,
            node,
            data: ts.dataTimeslices.map((dts:any) => {
                const d = {
                    startTime: dts.startTime
                } as any;
                Object.assign(d, dts.metricValue);
                return d as MetricData;
            })
        } as Metric;
        return metric;
    }
}
