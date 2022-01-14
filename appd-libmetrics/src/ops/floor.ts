import { MetricTimeseries } from "../api";
import { mapValues } from "../map";

/**
 * maps the MetricDataPoint values to a provided minimum value.  Any value subceeding the
 * floor is mapped to the floor, otherwise left as is.
 * currently, all gaps are preserved
 * THINKME if the floor is >= 0, should gaps be raised to the floor???
 * @param ts
 * @param floor 
 * @returns 
 */
export const floor = (ts:MetricTimeseries, floor:number) => mapValues(ts, (v) => v ? Math.max(floor, v) : v, "floor");
export default floor;
