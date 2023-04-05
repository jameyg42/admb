import { Arguments, BaseProcessor } from "./api";
import { log } from "@admb/libmetrics/out/ops/log";
import { MetricTimeseries } from "@admb/libmetrics";

export class LogProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return log(series);
    }
}
