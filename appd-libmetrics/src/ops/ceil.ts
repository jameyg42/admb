import { MetricTimeseries } from "../api";
import { mapValues } from "../map";

/**
 * maps the MetricDataPoint values to a provided maximum value.  Any value exceeding the
 * max is mapped to the max, otherwise left as is.
 * preserves gaps
 * @param ts
 * @param ceil 
 * @returns 
 */
export const ceil = (ts:MetricTimeseries, ceil:number) => mapValues(ts, (v) => v ? Math.min(ceil, v) : v, "ceil");
export default ceil;
