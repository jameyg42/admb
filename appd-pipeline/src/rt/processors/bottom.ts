import { Arguments, BaseProcessor } from "./api";
import { bottom } from "@metlife/appd-libmetrics/out/ops/bottom";
import { MetricTimeseries, MetricTimeseriesGroup } from "@metlife/appd-libmetrics";
import * as reducers from "@metlife/appd-libstats";
import { ReducerFn } from "@metlife/appd-libutils";

export class BottomProcessor extends BaseProcessor {
    execGroup(args:Arguments, group:MetricTimeseriesGroup) {
        const by = reducerMap[args.by as string] || 'avg';
        if (!by) {
            throw new SyntaxError(`invalid reducer function '${args.by}'`);
        }
        return bottom(group, args.size as number || 10, by)
    }
}

export const reducerMap:({[name:string]:ReducerFn<number,number>}) = {
    avg: reducers.avg,
    median: reducers.median,
    mode: reducers.mode,
    min: reducers.min,
    max: reducers.max
}
