import { Arguments, BaseProcessor } from "./api";
import { binary } from "@admb/libmetrics/out/ops/binary";
import { MetricTimeseries } from "@admb/libmetrics";

export class BinaryProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return binary(series);
    }
}
