import { Arguments, BaseProcessor } from "./api";
import { sort } from "@metlife/appd-libmetrics/out/ops/sort";
import { MetricTimeseriesGroup } from "@metlife/appd-libmetrics";
import { sorters } from "@metlife/appd-libmetrics/out/ops/sort";

export class SortProcessor extends BaseProcessor {
    execGroup(args:Arguments, series:MetricTimeseriesGroup):MetricTimeseriesGroup|Promise<MetricTimeseriesGroup> {
        const by = sorters[args.by as string || 'avg'];
        const descending = (args.dir || 'desc') == 'desc';
        if (!by) {
            throw new SyntaxError(`invalid sortBy function '${args.by}'`);
        }
        return sort(series, by, descending);
    }
}
