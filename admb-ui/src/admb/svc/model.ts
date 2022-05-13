export interface Application {
  id: number;
  name: string;
  type: string;
}


export interface MetricTimeseries {
  name: string;
  plotLayout?: PlotLayout;
  data: TimeseriesPoint[];
}
export interface TimeseriesPoint {
  start: number;
  value: number;
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
