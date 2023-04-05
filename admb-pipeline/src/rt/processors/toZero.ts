import { Arguments, BaseProcessor } from "./api";
import { toZero } from "@admb/libmetrics/out/ops/toZero";
import { MetricTimeseries } from "@admb/libmetrics";

export class ToZeroProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return toZero(series);
    }
}
