import { Arguments, BaseProcessor } from "./api";
import { sqrt } from "@admb/libmetrics/out/ops/sqrt";
import { MetricTimeseries } from "@admb/libmetrics";

export class SqrtProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return sqrt(series);
    }
}
