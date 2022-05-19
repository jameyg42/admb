import { Arguments, BaseProcessor } from "./api";
import { toZero } from "@metlife/appd-libmetrics/out/ops/toZero";
import { MetricTimeseries } from "@metlife/appd-libmetrics";

export class ToZeroProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return toZero(series);
    }
}
