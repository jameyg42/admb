export interface Application {
  id: number;
  name: string;
  type: string;
}


export interface MetricTimeseries {
  metricId: number;
  metricName: string;
  metricFullName: string;
  precision: number;
  node?: any;
  values?: string[];
  plotLayout?: PlotLayout;
  data: TimeseriesPoint[];
}
export interface TimeseriesPoint {
  start: number;
  value: number;
  current: number;
  min: number;
  max: number;
  sigma: number;
}
export interface PlotLayout {
  type: string;
  yaxis?: number;
  colors: string[];
}

export interface Range {
  type: string;
  startTime?: number;
  endTime?: number;
  durationInMinutes?: number;
}
