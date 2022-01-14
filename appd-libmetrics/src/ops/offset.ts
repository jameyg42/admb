import { MetricTimeseries } from "../api";
import { mapValues } from "../map";

/**
 * maps the MetricDataPoint values to the value plus the specified offset
 * preserves gaps.
 * @param ts 
 * @param offset
 * @returns 
 */
export const offset = (ts:MetricTimeseries, offset:number) => mapValues(ts, v => v ? v + offset : v, "offset");
export default offset;
