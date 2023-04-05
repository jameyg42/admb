import { Arguments, BaseProcessor } from "./api";
import { percentOf } from "@admb/libmetrics/out/ops/percentOf";
import { MetricTimeseriesGroup } from "@admb/libmetrics";

export class PercentOfProcessor extends BaseProcessor {
    execGroup(args:Arguments, series:MetricTimeseriesGroup):MetricTimeseriesGroup|Promise<MetricTimeseriesGroup> {
        const what = args.what as string;
        return percentOf(series, what);
    }
}
