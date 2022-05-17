import { Arguments, BaseProcessor } from "./api";
import { reciprocal } from "@metlife/appd-libmetrics/out/ops/reciprocal";
import { MetricTimeseries } from "@metlife/appd-libmetrics";

export class InvertProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return reciprocal(series);
    }
}
