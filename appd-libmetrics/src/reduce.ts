import { MetricTimeseries } from "./api"
import clone from "./clone";

export type DataValueReducerFn = (r:number, c:number, i:number) => number;

export const reduceValues = (series:MetricTimeseries[], reducer:DataValueReducerFn, named?:string) => {
    const result = clone(series[0]);
    result.name = series.map(ts => ts.name).join(',');

    
    

}
