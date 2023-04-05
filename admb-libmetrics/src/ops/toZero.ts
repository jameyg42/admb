import { min } from "@admb/libstats/out/min";
import { MetricTimeseries } from "../api";
import { extractValues, mapValues } from "../map";

/**
 * dynamically and equally offsets the values in the series so that the smallest value
 * is 0 (visually, it slides the series down [or up if dealing w/ negative values] to
 * the origin).
 * @param ts
 * @returns 
 */
export const toZero = (ts:MetricTimeseries) => {
    const offset = min(extractValues(ts).filter(v => v || v === 0)); // FIXME - need to figure out how libstats handles NaN
    return mapValues(ts, (v) => v ? v - offset : v, "toZero");
};
export default toZero;
