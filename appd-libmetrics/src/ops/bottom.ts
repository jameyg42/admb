import { MetricTimeseries } from "../api";
import { extractValues } from "../map";
import { DataValueReducerFn } from "../reduce";
import { avg } from "@metlife/appd-libstats";

export const bottom = (tss:MetricTimeseries[], size:number, by:DataValueReducerFn=avg) => {
    return tss
        .sort((a,b) => {
            const av = extractValues(a).reduce(by);
            const bv = extractValues(b).reduce(by);
            return av-bv;
        })
        .slice(0, size)
}
