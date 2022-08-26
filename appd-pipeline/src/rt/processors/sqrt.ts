import { Arguments, BaseProcessor } from "./api";
import { sqrt } from "@metlife/appd-libmetrics/out/ops/sqrt";
import { MetricTimeseries } from "@metlife/appd-libmetrics";

export class SqrtProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return sqrt(series);
    }
}
