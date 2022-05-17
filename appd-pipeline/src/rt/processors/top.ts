import { Arguments, BaseProcessor } from "./api";
import { top } from "@metlife/appd-libmetrics/out/ops/top";
import { MetricTimeseriesGroup } from "@metlife/appd-libmetrics";
import { sorters } from "@metlife/appd-libmetrics/out/ops/sort";

export class TopProcessor extends BaseProcessor {
    execGroup(args:Arguments, group:MetricTimeseriesGroup) {
        const by = sorters[args.by as string || 'avg'];
        if (!by) {
            throw new SyntaxError(`invalid sortBy function '${args.by}'`);
        }
        return top(group, args.size as number || 10, by)
    }
}
