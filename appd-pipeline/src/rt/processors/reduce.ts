import { MetricTimeseries } from "@metlife/appd-libmetrics";
import { Arguments, BaseProcessor } from "./api";

export class ReduceProcessor extends BaseProcessor {
    execGroup(args:Arguments, group:MetricTimeseries[]):MetricTimeseries[]|Promise<MetricTimeseries[]> {
        return [];
    }
}
