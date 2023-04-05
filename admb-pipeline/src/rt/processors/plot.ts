import { Arguments, BaseProcessor } from "./api";
import { MetricTimeseries } from "@admb/libmetrics";
import { merge } from "@admb/libutils";

export class PlotProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        series.metadata.plot = merge(series.metadata.plot || {}, args);
        return series;
    }
}