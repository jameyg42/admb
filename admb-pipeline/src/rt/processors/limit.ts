import { Arguments, BaseProcessor } from "./api";
import { limit } from "@admb/libmetrics/out/ops/limit";
import { MetricTimeseriesGroup } from "@admb/libmetrics";

export class LimitProcessor extends BaseProcessor {
    execGroup(args:Arguments, series:MetricTimeseriesGroup):MetricTimeseriesGroup|Promise<MetricTimeseriesGroup> {
        const value = args.amount as number;
        return limit(series, value);
    }
}
