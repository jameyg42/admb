import { MetricTimeseries } from "../api";
import { mapValues } from "../map";
import { isNumber } from "@admb/libutils";
import { avg } from "@admb/libstats";

/**
 * 
 * @param ts 
 * @param fnOrWindow 
 * @returns 
 */
export const smooth = (ts:MetricTimeseries, fnOrWindow:SmoothingFunction|number=moving()) => 
    (isNumber(fnOrWindow) ? moving(fnOrWindow as number) : fnOrWindow as SmoothingFunction)(ts);
export default smooth;

export type SmoothingFunction = (ts:MetricTimeseries) => MetricTimeseries;
export const moving = (window:number = 5) => (ts:MetricTimeseries) => mapValues(ts, (v, i, a) => {
    const before = Math.min(i, Math.round(window / 2));
    const after = window - before;

    const slice = a.slice(i-before, i+after);
    return slice.reduce(avg);
});
