import { MetricTimeseries } from "../api";
import { mapValues } from "../map";

/**
 * maps the MetricDataPoint values to the multiplicative inverse (reciprocal) of the value.
 * gaps are preserved.
 * @param ts 
 * @returns 
 */
export const reciprocal = (ts:MetricTimeseries) => mapValues(ts, v => v ? (v > 0 ? 1/v : 0) : v, "reciprocal");
export default reciprocal;
