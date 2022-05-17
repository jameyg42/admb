import { ReducerFn } from "@metlife/appd-libutils"
import { MetricTimeseries, MetricTimeseriesGroup } from "../api"
import { reduceGroup, GapHandlerFn } from "../reduce";

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
    return reduceGroup(tss, fn, gapHandler, `reduce:${fn.name || 'unknown'}`)
}
export default reduce;
