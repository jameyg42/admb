import { max, min } from "@admb/libstats";
import { MetricTimeseries } from "../api";
import { extractValues, mapValues } from "../map";

/**
 * maps the MetricDataPoint values to the min/max normalization.
 * This is especially useful if we want to compare series that are at
 * different scales since it rescales the series values to be between
 * 0 and 1.
 * preserves gaps
 * @param ts 
 * @returns 
 */
export const normalize = (ts:MetricTimeseries) => {
    const values = extractValues(ts);
    const n = min(values);
    const x = max(values);
    return mapValues(ts, v => (v - n) / (x - n), "normalize");
};
export default normalize;
