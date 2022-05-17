import { Arguments, BaseProcessor } from "./api";
import { integral } from "@metlife/appd-libmetrics/out/ops/integral";
import { MetricTimeseries } from "@metlife/appd-libmetrics";

export class IntegralProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return integral(series);
    }
}
