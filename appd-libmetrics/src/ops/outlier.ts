import { outlier as _outlier} from  "@metlife/appd-libstats/out/outlier";
import { MetricTimeseries } from "../api";
import { extractValues, mapWithValues } from "../map";

/**
 * removes outlier values from the MetricDataPoints.  By default, only values exceeding the
 * upper bound are removed - to also remove values subseeding the lower bound set 
 * removeLower to true.
 * preserves gaps.
 * @param ts
 * @param removeLower remove 
 * @returns 
 */
export const outlier = (ts:MetricTimeseries, removeLower?:boolean) => 
    mapWithValues(ts, _outlier(extractValues(ts), removeLower), "outlier");
export default outlier;
