export { MetricTimeseries, MetricTimeseriesGroup, Range } from "@metlife/appd-libmetrics/out/api"
export { App as Application } from "@metlife/appd-services/out/app/types";

export interface PlotLayout {
  type: string;
  yaxis?: number;
  colors: string[];
}
