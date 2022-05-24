import { MetricTimeseries } from "../api";
import { mapValues } from "../map";

/**
 * maps the MetricDataPoint values to e (logarithm base) raised to the value.
 * preserves gaps
 * @param ts 
 * @returns 
 */
export const e = (ts:MetricTimeseries) => mapValues(ts, (v) => v ? Math.exp(v) : v, "e");
export default e;
