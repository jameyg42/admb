import { Arguments, BaseProcessor } from "./api";
import { derivative } from "@admb/libmetrics/out/ops/derivative";
import { MetricTimeseries } from "@admb/libmetrics";

export class DerivativeProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return derivative(series);
    }
}
