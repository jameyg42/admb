import { MetricTimeseries, MetricTimeseriesGroup } from "../api";
import { pearson } from '@admb/libstats';
import { clone } from "@admb/libutils";
import { flatten, fill, chunk, zip } from "lodash";

export type Correlator = (x:number[], y:number[]) => number;

export function correlateGroup(tss:MetricTimeseriesGroup, fn:Correlator = pearson, window?:number):MetricTimeseriesGroup {
    const results:MetricTimeseries[] = [];

    if (tss.length > 1) {
        // correlate each member of the group with each other
        for (let i = 0; i < tss.length - 1; i++) {
            for (let j = i+1; j < tss.length; j++) {
                results.push(correlateSeries(tss[i], tss[j], fn, window));
            }
        }
    } else {
        const tsX = tss[0];
        const tsY = tss[1] || tsX;
        results.push(correlateSeries(tsX, tsY, fn, window));
    }
    return results;
}

export function correlateSeries(tsX:MetricTimeseries, tsY:MetricTimeseries, fn:Correlator = pearson, window?:number):MetricTimeseries {
    const result = clone(tsX);
    result.name = `corr(${tsX.name},${tsY.name})`;
    result.fullName = `corr(${tsX.fullName},${tsY.fullName})`;

    const X = tsX.data.map(d => d.value);
    const Y = tsY.data.map(d => d.value);
    const chunkSize = window || X.length;

    const ccs = flatten(
                    correlateChunks(X as number[], Y as number[], fn, chunkSize)
                    .map(cs => fill(Array(chunkSize), cs))
                );
    result.data.forEach((d,i) => d.value = ccs[i]); 
    return result;
}

function correlateChunks(X:number[], Y:number[], fn:Correlator, chunkSize:number) {
    const cX = chunk(X, chunkSize);
    const cY = chunk(Y, chunkSize);

    return zip(cX, cY)
            .map(([a, b]) => fn(a as number[], b as number[]));
        
}
