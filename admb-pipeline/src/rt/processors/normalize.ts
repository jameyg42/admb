import { Arguments, BaseProcessor } from "./api";
import { normalize } from "@admb/libmetrics/out/ops/normalize";
import { MetricTimeseries } from "@admb/libmetrics";

export class NormalizeProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return normalize(series);
    }
}
