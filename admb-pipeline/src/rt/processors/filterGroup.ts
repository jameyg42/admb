import { MetricTimeseriesGroup } from "@admb/libmetrics";
import { Arguments } from "../../lang/syntax";
import { BaseProcessor } from "./api";
import { filterGroup } from '@admb/libmetrics/out/ops/filter';

export class FilterGroupProcessor extends BaseProcessor {
    execGroup(args:Arguments, group:MetricTimeseriesGroup):MetricTimeseriesGroup|Promise<MetricTimeseriesGroup> {
        const mode = args.matching || 'every';
        if (mode !== 'every' && mode !== 'some') {
            throw new SyntaxError(`unexpected matching argument '${mode}' - should be one of every,some`);
        }
        
        return filterGroup(group, args.expr as string, mode) ? group : [];
    }
}
