import { ReducerFn, clone, isValidNumber, zip } from "@admb/libutils";
import { MetricDataPoint, MetricDataPointValue, MetricTimeseries, MetricTimeseriesGroup } from "./api"

/**
 * Reduce a set of MetricTimeseries to a single series.  
 * @param tss
 * @param reducer 
 * @param named 
 */
export function reduceGroup(tss:MetricTimeseriesGroup, reducer:ReducerFn<number, number>, gapHandler:GapHandlerFn = zeros, named?:string) {
    // FIXME threshold should be metadata only
    tss = tss.filter(ts => ts.name != 'threshold');
    
    const result = createReduceResultTarget(tss);
    result.name = tss.map(ts => ts.name).join(',');
    result.fullName = tss.map(ts => ts.fullName).join(',');
    if (named) {
        result.name = `${named}(${result.name})`;
        result.fullName = `${named}(${result.fullName})`;
    }
    result.sources = tss.map(ts => ts.source);

    const normalizedDataPoints = normalizeDataPointsRange(tss.map(ts => ts.data))
        .map(mdps => mdps
            .map(mdp => mdp.value)
            .map((v, i, a) => isValidNumber(v) ? v : gapHandler(a[i-1], a[i+1], i, a))
            .filter(v => isValidNumber(v))
            .map (v => v as number)
        );
    const values = zip(...normalizedDataPoints)
        .map(vs => vs
            .reduce(reducer)
        );
    
    result.data = result.data.map((d,i) => ({start:d.start, value:values[i]}));
    return result; // FIXMENOW metadata
}
export function createReduceResultTarget(tss:MetricTimeseriesGroup):MetricTimeseries {
    //TOD actually implement
    return clone(tss[0]);
}

export function normalizeSeriesRange(tss:MetricTimeseriesGroup):MetricTimeseriesGroup {
    if (tss.length < 2) return tss; // shortcut case - 0:1 series
    
    const normalizedValues = normalizeDataPointsRange(tss.map(ts => ts.data));
    tss.forEach((ts, i) => ts.data = normalizedValues[i]);
    return tss;
}
export function normalizeDataPointsRange(ds:MetricDataPoint[][]):MetricDataPoint[][] {
    let minStart = Number.MAX_SAFE_INTEGER;
    let maxEnd = Number.MIN_SAFE_INTEGER;
    let maxStep = 0;

    ds.forEach(d => {
        const start = d[0].start;
        const end = d[d.length-1].start;
        const step = (end - start) / d.length;

        minStart = Math.min(minStart, start);
        maxEnd = Math.max(maxEnd, end);
        maxStep = Math.max(maxStep, step);
    });
    return ds.map(d => {
        // TODO normalize step size
        const start = d[0].start;
        const startPaddingLen = (start - minStart) / maxStep;
        const startPadding = interval(minStart, maxStep, startPaddingLen);

        const end = d[d.length-1].start;
        const endPaddingLen = (maxEnd - end) / maxStep;
        const endPadding = interval(end, maxStep, endPaddingLen);

        const normalized = startPadding.concat(...d, ...endPadding);
        return normalized;
    });
}
function interval(start:number, step:number, len:number):MetricDataPoint[] {
    const interval:MetricDataPoint[] = [];
    for (let i = 0; i < len; i++) {
        interval.push({
            start: start + (i * step),
            value: undefined
        });
    } 
    return interval;
}


export type GapHandlerFn = (before:MetricDataPointValue, after:MetricDataPointValue, i:number, values:MetricDataPointValue[]) => MetricDataPointValue;
export const zeros:GapHandlerFn = () => 0;
export const fill:GapHandlerFn = (b, a) => a && b ? (a+b)/2 : a ? a : b ? b : 0;
export const preserve:GapHandlerFn = (b, a, i, as) => as[i];
export const skip:GapHandlerFn = () => NaN;
