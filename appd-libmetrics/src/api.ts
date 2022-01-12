export type KVs = {[key:string]:string};

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
    dimensions: KVs;
    precision: Precision;
    data: MetricDataPoint[]
}
export interface MetricDataPoint {
    start: number,
    value: number
}
