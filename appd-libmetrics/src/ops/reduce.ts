import { ReducerFn } from "@metlife/appd-libutils"
import { MetricTimeseries, MetricTimeseriesGroup } from "../api"
import { reduceGroup, GapHandlerFn } from "../reduce";
import { avg, sum, difference, product, min, max } from "@metlife/appd-libstats";

/**
 * reduces all the series in the group to a single series using the provided
 * reducer.  The reduction happens in a few steps:
 *  - the series are normalized with leading/trailing "undefined" MetricDataPoints
 *    so that the ranges are the same
 *  - the values for each start time are grouped together into an array
 *  - the values for each array are reduced using the reducer function - any
 *    null|undefined values are first processed by the provided gapHandler
 *    function
 *    
 * @param tss
 * @param fn 
 * @param gapHandler 
 * @returns 
 */
export const reduce = (tss:MetricTimeseriesGroup, fn:ReducerFn<number,number>, gapHandler?:GapHandlerFn):MetricTimeseries => {
    return reduceGroup(tss, fn, gapHandler, `reduce:${fn.name || (fn as any)._name || 'unknown'}`)
}
export default reduce;
export const reducersMap = {
    avg, sum, difference, product, min, max
} as ({[key:string]:ReducerFn<number,number>});

// hack - the reducers are currently created using arrows and don't have a name
Object.entries(reducersMap).forEach(([k,f]) => (f as any)._name = k);
