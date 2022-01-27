import { Arguments, BaseProcessor, CommandArgument, CommandDescription } from "./api";
import { bottom } from "@metlife/appd-libmetrics/out/ops/bottom";
import { MetricTimeseries, DataValueReducerFn } from "@metlife/appd-libmetrics";
import * as reducers from "@metlife/appd-libstats";

export class BottomProcessor extends BaseProcessor {
    execGroup(args:Arguments, group:MetricTimeseries[]):MetricTimeseries[]|Promise<MetricTimeseries[]> {
        const by = reducerMap[args.by as string];
        if (!by) {
            throw new SyntaxError(`invalid reducer function '${args.by}'`);
        }
        return bottom(group, args.size as number || 10, by)
    }

    description:CommandDescription = {
        name: 'bottom',
        shortDescription: 'Finds the bottom (smallest reduced value) series in each group',
        documentation: 'NOTE that this does not transform the series in any way.',
        arguments: argumentDescriptions
    };
}

// for reuse by top
export const argumentDescriptions:CommandArgument[] = [{
    name: 'size',
    type: 'number',
    documentation: 'the number of results to return (default is 10)',
    optional: true
}, {
    name: 'by',
    type: 'string',
    documentation: 'the function used to reduce the values for each individual series.  One of `avg`, ',
    optional: true
}];
export const reducerMap:({[name:string]:DataValueReducerFn}) = {
    avg: reducers.avg,
    median: reducers.median,
    mode: reducers.mode,
    min: reducers.min,
    max: reducers.max
}
