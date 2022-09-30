import { MetricTimeseries } from "@metlife/appd-libmetrics";
import { MetricsProvider, ValueType } from "./spi";
import { AppServices, Baseline, Client, MetricsExServices } from "@metlife/appd-services";
import { Context } from "../rt/interpreter";
import { flatten } from "lodash";
import { Range as AppDRange } from '@metlife/appd-services/out/range';



export class AppDynamicsMetricsProvider implements MetricsProvider {
    metrics: MetricsExServices;
    app: AppServices;
    constructor(private client:Client) {
        this.metrics = new MetricsExServices(client);
        this.app = new AppServices(client);
    }
    async browseTree(app:string, path:string[]):Promise<string[]> {
        const apps = await this.app.findApps(app);
        return Promise.all(
            apps.map(a => this.metrics.browse(a, path))
        )
        .then(flatten)
        .then(nodes => nodes.map(n => n.name));
    }
    async fetchMetrics(ctx:Context, app:string, path:string[], valueTypes:ValueType[]): Promise<MetricTimeseries[]> {
        const values = valueTypes.length > 0 ? valueTypes : [{type:'value'}];
        const baselines = values
            .filter(vt => vt.type == 'baseline' || vt.type == 'stddev')
            .map(vt => vt.baseline || 'DEFAULT')
            .sort()
            .filter((b, i, a) => i == 0 || b !== a[i-1]) as string[];
        const range = ctx.range as AppDRange; // FIXME for now these two are compatible so we can just assign to the AppD type
        
        const metricsEx = await this.app.findApps(app).then(apps => {
            if (apps.length == 0) {
                return [];
            }
            return Promise.all(
                apps.map(app => 
                    Promise.all(baselines.map(b => this.app.findBaseline(app, b)))
                    .then(baselines => baselines.filter(b => b) as Baseline[])
                    .then(baselines => 
                        this.metrics.fetchMetrics(app, path, range, ...baselines)
                    )
                )
            )
            .then(flatten);
        })

        const tss = metricsEx
        .filter(m => m.name !== 'METRIC DATA NOT FOUND' && m.data.length > 0)
        .map(m => {
            return values.map(value => {
                const source = {
                    app: m.node.app.name,
                    path: m.node.path
                }
                const ts = {
                    name: source.path[source.path.length-1],
                    fullName: `${source.app}:|${m.fullName}[${value.type}${value.baseline ? '@'+value.baseline : ''}]`,
                    source,
                    sources: [source],
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
