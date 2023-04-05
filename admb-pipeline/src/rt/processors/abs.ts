import { Arguments, BaseProcessor } from "./api";
import { abs } from "@admb/libmetrics/out/ops/abs";
import { MetricTimeseries } from "@admb/libmetrics";

export class AbsProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return abs(series);
    }
}
