import { MetricTimeseries } from "@metlife/appd-libmetrics";
import { Arguments, BaseProcessor } from "./api";
import { reduce, reducersMap } from "@metlife/appd-libmetrics/out/ops/reduce";

export class ReduceProcessor extends BaseProcessor {
    execGroup(args:Arguments, group:MetricTimeseries[]):MetricTimeseries[]|Promise<MetricTimeseries[]> {
        const fn = reducersMap[args.fn as string];
        return [reduce(group, fn)];
    }
}
