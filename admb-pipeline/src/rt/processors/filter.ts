import { MetricTimeseriesGroup } from "@admb/libmetrics";
import { Arguments } from "../../lang/syntax";
import { BaseProcessor } from "./api";
import { filter } from '@admb/libmetrics/out/ops/filter';

export class FilterProcessor extends BaseProcessor {
    execGroup(args:Arguments, series:MetricTimeseriesGroup):MetricTimeseriesGroup|Promise<MetricTimeseriesGroup> {
        return series.filter(ts => filter(ts, args.expr as string));
    }
}
