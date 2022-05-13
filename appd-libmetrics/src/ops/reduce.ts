import { ReducerFn, zip, isNumber, clone } from "@metlife/appd-libutils"
import { MetricTimeseries, MetricTimeseriesGroup } from "../api"
import { extractValues } from "../map";


export const reduce = (tss:MetricTimeseriesGroup, fn:ReducerFn<number,number>, gapHandler = skip):MetricTimeseries => {
    let last:any = undefined;
    const values = zip(...tss.map(extractValues))
        .map(vs => vs
            .map((v, i, a) => {
                if (isNumber(v)) return v;
                last = gapHandler(a[i-1] || last, a[i+1], i, a);
                return last;
            })
            .filter(v => (v as any) !== 'skip')
            .map((v:any) => v as number)
            .reduce(fn)
        )
    
    const r = clone(tss[0]);
    r.data.map((d,i) => ({start:d.start, value:values[i]}));
    return r; // FIXMENOW metadata
}
export type GapHandlerFn = (before:number|undefined, after:number|undefined, i:number, a:number[]) => number|undefined|'skip';
export const zeros:GapHandlerFn = () => 0;
export const fill:GapHandlerFn = (b, a) => a && b ? (a+b)/2 : a ? a : b ? b : 0;
export const preserve:GapHandlerFn = () => undefined;
export const skip:GapHandlerFn = () => 'skip';
