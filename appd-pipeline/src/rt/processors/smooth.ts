import { Arguments, BaseProcessor } from "./api";
import { smooth, moving } from "@metlife/appd-libmetrics/out/ops/smooth";
import { MetricTimeseries } from "@metlife/appd-libmetrics";

export class SmoothProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        const window = args.window as number || 10;
        return smooth(series, moving(window));
    }
}
