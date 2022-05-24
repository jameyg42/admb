import { Arguments, BaseProcessor } from "./api";
import { abs } from "@metlife/appd-libmetrics/out/ops/abs";
import { MetricTimeseries } from "@metlife/appd-libmetrics";

export class AbsProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return abs(series);
    }
}
