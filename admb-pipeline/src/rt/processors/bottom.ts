import { Arguments, BaseProcessor } from "./api";
import { bottom } from "@admb/libmetrics/out/ops/bottom";
import { MetricTimeseriesGroup } from "@admb/libmetrics";
import { sorters } from "@admb/libmetrics/out/ops/sort";

export class BottomProcessor extends BaseProcessor {
    execGroup(args:Arguments, group:MetricTimeseriesGroup) {
        const by = sorters[args.by as string || 'avg'];
        if (!by) {
            throw new SyntaxError(`invalid sortBy function '${args.by}'`);
        }
        return bottom(group, args.size as number || 10, by)
    }
}
