import { Arguments, BaseProcessor } from "./api";
import { MetricTimeseries } from "@metlife/appd-libmetrics";
import { tmpl, merge } from "@metlife/appd-libutils";

export class LabelProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        const expr = args.expr as string || '%{name}'
        const model = merge({
            args,  
            n: series.name,
            s: [series.source.app].concat(series.source.path)
        }, series);

        const l = tmpl.evaluate(expr, model);
        series.fullName = l;
        return series;
    }
}
