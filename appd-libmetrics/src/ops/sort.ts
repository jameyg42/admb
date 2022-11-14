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

const valuesSort = (reducer:ReducerFn<number, number>):SortBy => (descending:boolean) => (a:MetricTimeseries,b:MetricTimeseries) => {
    [a,b] = direction(descending, a, b);
    const av = extractValues(a).reduce(reducer);
    const bv = extractValues(b).reduce(reducer);
    return av - bv;
};
const nameSort = (args:string):SortBy                         => (descending:boolean) => (a:MetricTimeseries,b:MetricTimeseries) => {
    [a,b] = direction(descending, a, b);
    const ap = rex(args, a.name);
    const bp = rex(args, b.name);
    return ap.localeCompare(bp);
};
const segmentSort = (idx:number):SortBy                       => (descending:boolean) => (a:MetricTimeseries,b:MetricTimeseries) => {
    [a,b] = direction(descending, a, b);
    const ap = a.source.path[idx-1] || a.name;
    const bp = b.source.path[idx-1] || b.name;
    return ap.localeCompare(bp);
};

export const sorterFactories = {
    name: (args:string) => nameSort(args),
    segment: (idx:number) => segmentSort(idx),
    avg: () => valuesSort(avg),
    mean: () => valuesSort(avg),
    median: () => valuesSort(median),
    mode: () => valuesSort(mode),
    min: () => valuesSort(min),
    max: () => valuesSort(max)
} as SorterFactories;
export const sorters = {
    avg: sorterFactories.avg(),
    mean: sorterFactories.mean(),
    median: sorterFactories.median(),
    mode: sorterFactories.mode(),
    min: sorterFactories.min(),
    max: sorterFactories.max()
} as Sorters;
export type SorterFactories = ({[key:string]:(a?:any)=>SortBy});
export type Sorters = ({[key:string]:SortBy})

function direction(descending:boolean, a:any, b:any):[a:MetricTimeseries,b:MetricTimeseries] {
    return descending ? [b,a] : [a,b];
}
function rex(r:string, s:string):string {
    if (!r) {
        return s;
    }
    const m = new RegExp(r).exec(s);
    return m ? 
        m.length == 1 ? m[0] : m.slice(1).join()
        : ''
}
