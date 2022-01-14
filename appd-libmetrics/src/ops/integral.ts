import { MetricTimeseries } from "../api";
import { mapValues } from "../map";

const safe = (v:number) => v ? v : 0;
/**
 * maps the MetricDataPoint values to be the value plus the preceeding value.
 * the opposite of derivative.
 * currently, gaps are not preserved and instead missing values are treated as 0
 * @param ts
 * @returns 
 */
export const integral = (ts:MetricTimeseries) => 
    mapValues(ts, (v, i, a) => i == 0 ? 0 : safe(v) + safe(a[i-1]), "integral");

export default integral;
