import { MetricTimeseries } from "@admb/libmetrics";
import { Arguments, BaseProcessor } from "./api";
import { reduce, reducersMap } from "@admb/libmetrics/out/ops/reduce";

export class ReduceProcessor extends BaseProcessor {
    execGroup(args:Arguments, group:MetricTimeseries[]):MetricTimeseries[]|Promise<MetricTimeseries[]> {
        const fn = reducersMap[args.fn as string];
        return [reduce(group, fn)];
    }
}
