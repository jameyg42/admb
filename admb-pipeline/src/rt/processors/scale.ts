import { Arguments, BaseProcessor } from "./api";
import { scale } from "@admb/libmetrics/out/ops/scale";
import { MetricTimeseries } from "@admb/libmetrics";

export class ScaleProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return scale(series, args.factor as number);
    }
}
