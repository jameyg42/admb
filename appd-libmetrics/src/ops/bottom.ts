import { MetricTimeseriesGroup } from "../api";
import { sort, SortBy, sorters } from "./sort";
import { limit } from "./limit";

/**
 * returns the bottom (least by provided reducer) `<size>` results.
 * This is a shortcut for `limit(sort(asc),size)`.
 * @param tss 
 * @param size 
 * @param by 
 * @returns 
 */
 export const bottom = (tss:MetricTimeseriesGroup, size:number, by:SortBy=sorters.avg) => 
    limit(sort(tss, by, false), size);
 export default bottom;
