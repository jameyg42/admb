import { MetricTimeseries } from '@metlife/appd-libmetrics';
import { Context } from '../rt/interpreter';

export interface MetricsProvider {
    browseTree(app:string, path:string[]):Promise<string[]>;
    fetchMetrics(ctx:Context, app:string, path:string[], valueTypes:ValueType[]): Promise<MetricTimeseries[]>;
}

export interface ValueType {
    type:string;
    baseline?:string;
}
