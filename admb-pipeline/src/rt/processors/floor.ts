import { Arguments, BaseProcessor } from "./api";
import { floor } from "@admb/libmetrics/out/ops/floor";
import { MetricTimeseries } from "@admb/libmetrics";

export class FloorProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        const value = args.value as number;
        return floor(series, value);
    }
}
