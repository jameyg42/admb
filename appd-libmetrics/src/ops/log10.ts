import { MetricTimeseries } from "../api";
import { mapValues } from "../map";

/**
 * maps the MetricDataPoint values the base 10 logarithm of the value
 * preserves gaps
 * @param ts 
 * @returns 
 */
export const log10 = (ts:MetricTimeseries) => mapValues(ts, (v) => v ? Math.log10(v) : v, "log10");
export default log10;
