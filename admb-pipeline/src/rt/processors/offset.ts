import { Arguments, BaseProcessor } from "./api";
import { offset } from "@admb/libmetrics/out/ops/offset";
import { MetricTimeseries } from "@admb/libmetrics";

export class OffsetProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        const value = args.value as number;
        return offset(series, value);
    }
}
