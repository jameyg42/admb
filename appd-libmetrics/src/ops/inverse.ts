import { MetricTimeseries } from "../api";
import { mapValues } from "../map";

/**
 * maps the MetricDataPoint values to the additive inverse of the value.
 * This is functionally equivalent to scale(-1), but is included as a
 * compliment to reciprocal()
 * gaps are preserved.
 * @param ts 
 * @returns 
 */
export const inverse = (ts:MetricTimeseries) => mapValues(ts, v => v ? -v : v, "inverse");
export default inverse;
