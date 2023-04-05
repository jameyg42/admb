import { Arguments, BaseProcessor } from "./api";
import { ceil } from "@admb/libmetrics/out/ops/ceil";
import { MetricTimeseries } from "@admb/libmetrics";

export class CeilProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        const value = args.value as number;
        return ceil(series, value);
    }
}
