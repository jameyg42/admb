import { Arguments, BaseProcessor } from "./api";
import { e } from "@metlife/appd-libmetrics/out/ops/e";
import { MetricTimeseries } from "@metlife/appd-libmetrics";

export class EProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return e(series);
    }
}
