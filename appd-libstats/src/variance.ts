import { reducerOrFn, mockReducer } from "@metlife/appd-libutils/out/arrays";
import mean from "./mean";

export const variance = reducerOrFn(mockReducer<number>((a:number[]) => {
    if (a.length == 0) return 0;
    const mx = mean(a);
    const variance = a
        .map(d => d - mx)
        .map(d => d*d)
        .reduce(mean);
    return variance;
}));

export default variance;
