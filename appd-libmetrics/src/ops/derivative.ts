import { MetricTimeseries } from "../api";
import { mapValues } from "../map";

const safe = (v:number) => v ? v : 0;

/**
 * maps the MetricDataPoint values to be the difference of the value and the previous value.
 * This is especially useful if the metric is a continuously adding counter but you want to 
 * see the change over time.
 * The opposite of integral.
 * currently, gaps are not preserved and instead missing values are treated as 0
 * @param ts
 * @returns 
 */
export const derivative = (ts:MetricTimeseries) => 
    mapValues(ts, (v, i, a) => i == 0 ? 0 : safe(v) - safe(a[i-1]), "derivative");
export default derivative;
