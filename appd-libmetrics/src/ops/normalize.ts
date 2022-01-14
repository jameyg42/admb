import _min from "@metlife/appd-libstats/out/min";
import _max from "@metlife/appd-libstats/out/max";
import { MetricTimeseries } from "../api";
import { mapValues } from "../map";

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
    const values = ts.data.map(dp => dp.value);
    const min = _min(values);
    const max = _max(values);
    return mapValues(ts, v => (v - min) / (max - min), "normalize");
};
export default normalize;
