import { Arguments, BaseProcessor } from "./api";
import { log } from "@metlife/appd-libmetrics/out/ops/log";
import { MetricTimeseries } from "@metlife/appd-libmetrics";

export class LogProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return log(series);
    }
}
