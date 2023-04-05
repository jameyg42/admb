import { Arguments, BaseProcessor } from "./api";
import { integral } from "@admb/libmetrics/out/ops/integral";
import { MetricTimeseries } from "@admb/libmetrics";

export class IntegralProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return integral(series);
    }
}
