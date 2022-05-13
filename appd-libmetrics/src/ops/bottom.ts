import { MetricTimeseriesGroup } from "../api";
import { avg } from "@metlife/appd-libstats";
import { sort } from "./sort";
import { limit } from "./limit";
import { ReducerFn } from "@metlife/appd-libutils";

/**
 * returns the bottom (least by provided reducer) `<size>` results.
 * This is a shortcut for `limit(sort(asc),size)`.
 * @param tss 
 * @param size 
 * @param by 
 * @returns 
 */
 export const bottom = (tss:MetricTimeseriesGroup, size:number, by:ReducerFn<number,number>=avg) => 
    limit(sort(tss, by, false), size);
 export default bottom;
