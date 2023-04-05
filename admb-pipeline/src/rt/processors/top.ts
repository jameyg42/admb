import { Arguments, BaseProcessor } from "./api";
import { top } from "@admb/libmetrics/out/ops/top";
import { MetricTimeseriesGroup } from "@admb/libmetrics";
import { sorters } from "@admb/libmetrics/out/ops/sort";

export class TopProcessor extends BaseProcessor {
    execGroup(args:Arguments, group:MetricTimeseriesGroup) {
        const by = sorters[args.by as string || 'avg'];
        if (!by) {
            throw new SyntaxError(`invalid sortBy function '${args.by}'`);
        }
        return top(group, args.size as number || 10, by)
    }
}
