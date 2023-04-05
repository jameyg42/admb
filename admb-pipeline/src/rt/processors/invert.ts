import { Arguments, BaseProcessor } from "./api";
import { reciprocal } from "@admb/libmetrics/out/ops/reciprocal";
import { MetricTimeseries } from "@admb/libmetrics";

export class InvertProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return reciprocal(series);
    }
}
