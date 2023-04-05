export { MetricTimeseries, MetricTimeseriesGroup, Range } from "@admb/libmetrics/out/api"
export { App as Application } from "@admb/services/out/app/types";

export interface PlotLayout {
  type: string;
  yaxis?: number;
  colors: string[];
}
