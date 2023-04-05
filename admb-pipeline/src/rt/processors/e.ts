import { Arguments, BaseProcessor } from "./api";
import { e } from "@admb/libmetrics/out/ops/e";
import { MetricTimeseries } from "@admb/libmetrics";

export class EProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return e(series);
    }
}
