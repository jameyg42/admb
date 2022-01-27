import { MetricTimeseries } from "./api"
import clone from "./clone";

export type DataValueReducerFn = (r:number, c:number, i:number) => number;
export type SeriesReducerFn = (r:number, c:number[], i:number) => number;
/**
 * Reduce a set of MetricTimeseries to a single series.  Currently, this does *not*
 * align the Timeseries to the same range/precision and simply zips the data by 
 * index, reducing each value with the same index.  
 * @param tss
 * @param reducer 
 * @param named 
 */
export const reduceSeries = (tss:MetricTimeseries[], reducer:DataValueReducerFn, ignoreGaps?: boolean, named?:string) => {
    const result = clone(tss[0]);
    result.name = tss.map(ts => ts.name).join(',');
    if (named) {
        result.name = `${named}(${result.name})`;
    }

    // result.data = tss
    //     .map(ts => ts.data.map(d => d.value))
    //     .map(zv => zv.reduce(reducer))

}

/**
 * reduces the values of a single MetricTimeseries to a single value.  This
 * is just a utility for series.data.map(value).reduce(fn)
 */
export const reduceValues = (ts:MetricTimeseries, reducer:DataValueReducerFn):MetricTimeseries => {
    const value = ts.data.map(d => d.value).reduce(reducer);
    const c = clone(ts);
    c.data.map(d => d.value = value);
    return c;
}
