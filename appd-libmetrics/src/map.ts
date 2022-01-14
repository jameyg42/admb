import { MetricDataPoint, MetricTimeseries } from "./api"
import { clone } from "./clone";

export type DataPointMapperFn = (dp:MetricDataPoint, i:number, a:MetricDataPoint[]) => MetricDataPoint;
/**
 * Maps the MetricDataPoints of the given MetricTimeseries with the provided mapper.
 * The original Timeseries is preserved and a new Timeseries is returned.
 * The mapping exection can also be given a name which will mutate the name of the 
 * returned Timeseries to be {providedName}({originalName})
 * @param ts
 * @param fn 
 * @param named 
 * @returns 
 */
export const map = (ts:MetricTimeseries, fn:DataPointMapperFn, named?:string) => {
    const cts = clone(ts);
    if (named) {
        cts.name = `${named}(${cts.name})`;
    }
    cts.data = cts.data.map(fn);
    return cts;
} 
/**
 * Replaces the MetricDataPoint values in the provided MetricTimeseries with the
 * provided set of values.  The values are simply mapped by index of the provided
 * value set.
 * The original Timeseries is preserved and a new Timeseries is returned.
 * The mapping exection can also be given a name which will mutate the name of the 
 * returned Timeseries to be {providedName}({originalName})
 * @param ts
 * @param vs 
 * @param named 
 * @returns 
 */
export const mapWithValues = (ts:MetricTimeseries, values:number[], named?:string) => {
    return map(ts, (dp, i) => {
        dp.value = values[i];
        return dp;
    }, named);
}

export type DataValueMapperFn = (v:number, i:number, a:number[]) => number;
/**
 * Maps the MetricDataPoint values of the given MetricTimeseries with the provided mapper.
 * The original Timeseries is preserved and a new Timeseries is returned.
 * The mapping exection can also be given a name which will mutate the name of the 
 * returned Timeseries to be {providedName}({originalName})
 * @param ts 
 * @param fn 
 * @param named 
 * @returns 
 */
export const mapValues = (ts:MetricTimeseries, fn:DataValueMapperFn, named?:string) => {
    const values = extractValues(ts).map(fn);
    return mapWithValues(ts, values, named);
}

export const extractValues = (ts:MetricTimeseries) => ts.data.map(dp => dp.value);
