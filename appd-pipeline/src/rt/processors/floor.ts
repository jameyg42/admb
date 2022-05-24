import { Arguments, BaseProcessor } from "./api";
import { floor } from "@metlife/appd-libmetrics/out/ops/floor";
import { MetricTimeseries } from "@metlife/appd-libmetrics";

export class FloorProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        const value = args.value as number;
        return floor(series, value);
    }
}
