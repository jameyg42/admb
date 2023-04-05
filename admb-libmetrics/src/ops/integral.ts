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
export const integral = (ts:MetricTimeseries) => {
    let total = 0;
    return mapValues(ts, (v, i, a) => {
        total += safe(v);
        return total;
    }, "integral");

}
export default integral;
