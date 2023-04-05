import { KVP } from "@admb/libutils/out/types";

export type RangeType = 'BEFORE_NOW'|'BETWEEN_TIMES';
export interface Range {
    type: RangeType;
    startTime?: number;
    endTime?: number;
    durationInMinutes?: number;
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
    name: string;
    fullName: string;
    sources: Source[];
    source: Source;
    range: Range;
    value: string;
    precision: Precision;
    data: MetricDataPoint[];
    metadata: KVP<any>;
}
export interface Source {
    app: string;
    path: string[];
}
export type MetricTimeseriesGroup = MetricTimeseries[];
export interface MetricDataPoint {
    start: number,
    value: MetricDataPointValue
}
export type MetricDataPointValue = number|null|undefined;
