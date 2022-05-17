import { KVP } from "@metlife/appd-libutils";

export interface Range {
    startTime: number;
    endTime: number;
}
export interface Precision {
    size: number;
    units: PrecisionUnit;
}
export enum PrecisionUnit {
    Minutes = 'm',
    Hours = 'h'
}
export interface MetricTimeseries {
    app: string;
    name: string;
    path: string[];
    range: Range;
    value: string;
    precision: Precision;
    data: MetricDataPoint[];
    metadata: KVP<any>;
}
export type MetricTimeseriesGroup = MetricTimeseries[];
export interface MetricDataPoint {
    start: number,
    value: MetricDataPointValue
}
export type MetricDataPointValue = number|null|undefined;
