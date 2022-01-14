import { MetricTimeseries } from "../api";
import { mapValues } from "../map";

/**
 * maps the MetricDataPoint values the natural logarithm of the value
 * preserves gaps
 * @param ts 
 * @returns 
 */
export const log = (ts:MetricTimeseries) => mapValues(ts, (v) => v ? Math.log(v) : v, "log");
export default log;
