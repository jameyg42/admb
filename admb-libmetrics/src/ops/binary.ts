import { MetricTimeseries } from "../api";
import { mapValues } from "../map";

/**
 * maps the MetricDataPoint values to a binary (1 or 0) form.  Any 0 or undefined
 * value is a 0, otherwise a 1 (including negative values).
 * gaps are mapped to 0
 * @param ts
 * @returns 
 */
export const binary = (ts:MetricTimeseries) => mapValues(ts, v => !v || v == 0 ? 0 : 1, 'binary');
export default binary;
