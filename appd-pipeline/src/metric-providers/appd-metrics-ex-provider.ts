import { MetricTimeseries } from "@metlife/appd-libmetrics";
import { MetricsProvider } from "./spi";
import { AppServices, Baseline, Client, MetricsExServices } from "@metlife/appd-services";
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
    async fetchMetrics(ctx:Context, search:SearchExpressionNode): Promise<MetricTimeseries[]> {
        const values = search?.values.length > 0 ? search.values : [{type:'value'} as ValueTypeNode];
        const baselines = values
            .filter(vt => vt.type == 'baseline' || vt.type == 'stddev')
            .map(vt => vt.baseline || 'DEFAULT')
            .sort()
            .filter((b, i, a) => i == 0 || b !== a[i-1]) as string[];
        const range = between(ctx.range.startTime, ctx.range.endTime);
        
        const metricsEx = await this.app.findApps(search.app).then(apps => {
            if (apps.length == 0) {
                return [];
            }
            return Promise.all(
                apps.map(app => 
                    Promise.all(baselines.map(b => this.app.findBaseline(app, b)))
                    .then(baselines => baselines.filter(b => b) as Baseline[])
                    .then(baselines => 
                        this.metrics.fetchMetrics(app, search.path, range, ...baselines)
                    )
                )
            )
            .then(flatten);
        })

        const tss = metricsEx
        .filter(m => m.name !== 'METRIC DATA NOT FOUND' && m.data.length > 0)
        .map(m => {
            return values.map(value => {
                const ts = {
                    app: m.node.app.name,
                    name: m.name,
                    path: m.node.path,
                    range: ctx.range,
                    value: value.type,
                    precision: {size:m.precision, units:'m'},
                    metadata: {}
                } as any;
                if (value.type == 'baseline' || value.type == 'stddev') {
                    const data = m.baselineData.find(bd => 
                        bd.baseline.name == value.baseline || bd.baseline.seasonality == value.baseline
                    )?.data;
                    ts.data = data?.map(d => ({
                        start: d.startTime,
                        value: value.type == 'baseline' ? d.value : d.standardDeviation
                    }));
                } else {
                    ts.data = m.data.map((d:any) => ({
                        start: d.startTime,
                        value: d[value.type]
                    }));
                }
                return ts as MetricTimeseries;
            })
            .filter(ts => ts.data);
        });

        return flatten(tss);
    } 
}
