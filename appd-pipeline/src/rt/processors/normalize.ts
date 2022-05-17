import { Arguments, BaseProcessor } from "./api";
import { normalize } from "@metlife/appd-libmetrics/out/ops/normalize";
import { MetricTimeseries } from "@metlife/appd-libmetrics";

export class NormalizeProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return normalize(series);
    }
}
