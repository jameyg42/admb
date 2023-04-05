import { Arguments, BaseProcessor } from "./api";
import { log10 } from "@admb/libmetrics/out/ops/log10";
import { MetricTimeseries } from "@admb/libmetrics";

export class Log10Processor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return log10(series);
    }
}
