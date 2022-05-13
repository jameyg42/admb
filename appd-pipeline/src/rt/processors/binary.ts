import { Arguments, BaseProcessor } from "./api";
import { binary } from "@metlife/appd-libmetrics/out/ops/binary";
import { MetricTimeseries } from "@metlife/appd-libmetrics";

export class BinaryProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return binary(series);
    }
}
