import { MetricTimeseries } from "../api";
import { mapValues } from "../map";

/**
 * maps the MetricDataPoint values to square root of the value
 * gaps are preserved
 * @param ts
 * @returns 
 */
export const sqrt = (ts:MetricTimeseries) => mapValues(ts, (v) => v ? Math.sqrt(v) : v, "sqrt");
export default sqrt;
