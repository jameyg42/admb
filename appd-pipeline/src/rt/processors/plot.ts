import { Arguments, BaseProcessor } from "./api";
import { MetricTimeseries } from "@metlife/appd-libmetrics";
import { merge } from "@metlife/appd-libutils";

export class PlotProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        series.metadata.plot = merge(series.metadata.plot || {}, args);
        return series;
    }
}