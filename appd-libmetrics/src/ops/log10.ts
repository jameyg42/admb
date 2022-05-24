import { MetricTimeseries } from "../api";
import { mapValues } from "../map";

/**
 * maps the MetricDataPoint values the base 10 logarithm of the value
 * preserves gaps
 * @param ts 
 * @returns 
 */
export const log = (ts:MetricTimeseries) => mapValues(ts, (v) => v ? Math.log10(v) : v, "log");
export default log;
