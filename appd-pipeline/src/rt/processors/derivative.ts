import { Arguments, BaseProcessor } from "./api";
import { derivative } from "@metlife/appd-libmetrics/out/ops/derivative";
import { MetricTimeseries } from "@metlife/appd-libmetrics";

export class DerivativeProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return derivative(series);
    }
}
