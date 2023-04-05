import { Arguments, BaseProcessor } from "./api";
import { sort } from "@admb/libmetrics/out/ops/sort";
import { MetricTimeseriesGroup } from "@admb/libmetrics";
import { sorterFactories } from "@admb/libmetrics/out/ops/sort";

export class SortProcessor extends BaseProcessor {
    execGroup(args:Arguments, series:MetricTimeseriesGroup):MetricTimeseriesGroup|Promise<MetricTimeseriesGroup> {
        const by = args.by as string || 'avg';
        if (!by) {
            throw new SyntaxError(`invalid sortBy function '${args.by}'`);
        }

        const parsed = /(\w+)(?:\[(\w+)\])?(?:\((\w+)\))?/.exec(by);
        const parsedBy = parsed ? parsed[1] : by;
        const parsedArgs = parsed ? parsed[2] : undefined;
        const descending = (args.dir || 'desc') == 'desc';

        const byFactory = sorterFactories[parsedBy];
        if (!byFactory) {
            throw new SyntaxError(`unknown sort-by function '${by}`);
        }
        const byFn = byFactory(parsedArgs);
        

        return sort(series, byFn, descending);
    }
}
