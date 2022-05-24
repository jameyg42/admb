import { MetricTimeseries, MetricTimeseriesGroup } from "../api";
import { extractValues } from "../map";
import { avg, min, max, median, mode } from "@metlife/appd-libstats";
import { ReducerFn } from "@metlife/appd-libutils";

/**
 * Sorts the members of the provided group using the provided sorter function
 * in the specified order.
 * @param tss
 * @param by 
 * @param descending 
 * @returns 
 */
export const sort = (tss:MetricTimeseriesGroup, by:SortBy, descending=false) => {
    return tss.sort(by(descending));
}
export default sort;

export type SortBy = (descending:boolean) => (a:MetricTimeseries, b:MetricTimeseries) => number;

export const valuesSort = (reducer:ReducerFn<number, number>):SortBy => (descending:boolean) => 
(a:MetricTimeseries,b:MetricTimeseries) => {
    const av = extractValues(a).reduce(reducer);
    const bv = extractValues(b).reduce(reducer);
    return descending ? bv-av : av-bv;
};


export const sorters = {
    avg: valuesSort(avg),
    mean: valuesSort(avg),
    median: valuesSort(median),
    mode: valuesSort(mode),
    min: valuesSort(min),
    max: valuesSort(max)
} as Sorters;
export type Sorters = ({[key:string]:SortBy});
