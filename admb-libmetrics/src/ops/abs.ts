import { MetricTimeseries } from "../api";
import { mapValues } from "../map";

/**
 * maps the MetricDataPoint values to their absolute value.
 * preserves gaps.
 * @param ts 
 * @returns 
 */
export const abs = (ts:MetricTimeseries) => mapValues(ts, v => v ? Math.abs(v) : v, "abs");
export default abs;
