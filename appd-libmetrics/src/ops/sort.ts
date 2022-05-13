import { MetricTimeseriesGroup } from "../api";
import { extractValues } from "../map";
import { avg } from "@metlife/appd-libstats";
import { ReducerFn } from "@metlife/appd-libutils";

/**
 * Sorts the members of the provided group using the provided reducer function
 * in the specified order.
 * @param tss
 * @param by 
 * @param descending 
 * @returns 
 */
export const sort = (tss:MetricTimeseriesGroup, by:ReducerFn<number,number>=avg, descending=false) => {
    return tss
        .sort((a,b) => {
            const av = extractValues(a).reduce(by);
            const bv = extractValues(b).reduce(by);
            return descending ? bv-av : av-bv;
        })
}
export default sort;
