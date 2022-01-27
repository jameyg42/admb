import { MetricTimeseries } from "@metlife/appd-libmetrics";
import { MetricsProvider } from "./spi";
import { AppServices, Client, Metric, MetricsExServices } from "@metlife/appd-services";
import { Context } from "../rt/interpreter";
import { SearchExpressionNode, ValueTypeNode } from "../lang/syntax";
import { flatten } from "lodash";

import { between } from "@metlife/appd-services/out/range";


export class AppDynamicsMetricsProvider implements MetricsProvider {
    metrics: MetricsExServices;
    app: AppServices;
    constructor(private client:Client) {
        this.metrics = new MetricsExServices(client);
        this.app = new AppServices(client);
    }
    fetchMetrics(ctx:Context, search:SearchExpressionNode): Promise<MetricTimeseries[]> {
        return this.app.findApps(search.app)
        .then(apps => {
            if (apps.length == 0) {
                return [];
            }
            return Promise.all(apps.map(app => {
        ///////
        const range = between(ctx.range.startTime, ctx.range.endTime);
        const baselineSearches = search?.values
            .filter(vt => vt.baseline)
            .map(vt => vt.baseline)
            .sort()
            .filter((b, i, a) => i > 0 && b !== a[i-1])
            .map(b => 
                this.app.findBaseline(app, b)
                .then(b => this.metrics.fetchMetrics(app, search.path, range, b))
            );
        const searches = [this.metrics.fetchMetrics(app, search.path, range)]
                        .concat(...baselineSearches);

        return Promise.all(searches)
        .then(flatten)
        .then(results => {
            if (results.length == 0) {
                return [] as MetricTimeseries[];
            }
            const vts = search?.values.length > 0 ? search.values : [{type:'value'} as ValueTypeNode]
            return vts.map(vt => {
                    let ts:any = results[0];
                    if (vt.baseline) {
                        ts = results.find(t => t.baseline == vt.baseline) || null;
                    }
                    return {ts, vt};
                })
                .filter(({ts,vt}) => ts)
                .map(({ts,vt}) => {
                    return {
                        app: app.name,
                        name: ts.node.name,
                        path: ts.node.path,
                        range: ctx.range,
                        value: vt.type,
                        dimensions: {},
                        precision: {size:0, units:'m'},
                        metadata: {},
                        data: ts.data.map((d:any) => ({
                            start: d.startTime,
                            value: d[vt.type]
                        }))
                    } as MetricTimeseries;
                })
        });

        ///////
            }))
        })
        .then(flatten)
    } 
}
