import { Arguments, BaseProcessor } from "./api";
import { scale } from "@metlife/appd-libmetrics/out/ops/scale";
import { MetricTimeseries } from "@metlife/appd-libmetrics";

export class ScaleProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return scale(series, args.factor as number);
    }
}
