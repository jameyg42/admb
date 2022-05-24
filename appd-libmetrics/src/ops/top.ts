import { MetricTimeseriesGroup } from "../api";
import { sort, SortBy, sorters } from './sort';
import { limit } from './limit';

/**
 * returns the top (greatest by provided reducer) `<size>` results.
 * This is a shortcut for `limit(sort(desc),size)`.
 * @param tss 
 * @param size 
 * @param by 
 * @returns 
 */
 export const top = (tss:MetricTimeseriesGroup, size:number, by:SortBy=sorters.avg) => 
    limit(sort(tss, by, true), size);
 export default top;
