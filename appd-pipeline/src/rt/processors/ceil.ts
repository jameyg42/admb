import { Arguments, BaseProcessor } from "./api";
import { ceil } from "@metlife/appd-libmetrics/out/ops/ceil";
import { MetricTimeseries } from "@metlife/appd-libmetrics";

export class CeilProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        const value = args.value as number;
        return ceil(series, value);
    }
}
