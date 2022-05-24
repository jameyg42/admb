import { MetricTimeseries } from "../api";
import { mapValues } from "../map";

/**
 * maps the MetricDataPoint values to the value scaled by the provided factor
 * currently, all gaps are preserved
 * @param ts
 * @param factor
 * @returns 
 */
export const scale = (ts:MetricTimeseries, factor:number) => mapValues(ts, (v) => v ? v * factor: v, "scale");
export default scale;
