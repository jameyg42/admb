import { MetricTimeseriesGroup } from "../api";
import { avg } from "@metlife/appd-libstats";
import { sort } from './sort';
import { limit } from './limit';
import { ReducerFn } from "@metlife/appd-libutils";

/**
 * returns the top (greatest by provided reducer) `<size>` results.
 * This is a shortcut for `limit(sort(desc),size)`.
 * @param tss 
 * @param size 
 * @param by 
 * @returns 
 */
export const top = (tss:MetricTimeseriesGroup, size:number, by:ReducerFn<number,number>=avg) => 
    limit(sort(tss, by, true), size);
export default top;
