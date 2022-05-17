import { Arguments, BaseProcessor } from "./api";
import { outlier } from "@metlife/appd-libmetrics/out/ops/outlier";
import { MetricTimeseries } from "@metlife/appd-libmetrics";

export class OutlierProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return outlier(series);
    }
}
