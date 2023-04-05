import { Arguments, BaseProcessor } from "./api";
import { outlier } from "@admb/libmetrics/out/ops/outlier";
import { MetricTimeseries } from "@admb/libmetrics";

export class OutlierProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return outlier(series);
    }
}
