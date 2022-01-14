import { MetricTimeseries } from "../api";
import { map } from "../map";

/**
 * Logically shifts the MetricTimeseries in time by the provided number of minutes.
 * This simply adds the specified number of minutes to each MetricDataPoint start time.
 * @param ts
 * @param minutes 
 * @returns 
 */
export const shift = (ts:MetricTimeseries, minutes:number) => 
    map(ts, dp => {
        dp.start += minutes * 60 * 1000;
        return dp;
    })
export default shift;
