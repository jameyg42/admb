import { reducerOrFn, mockReducer } from "@metlife/appd-libutils/out/arrays";

/**
 * Returns the mode (most common) of all numbers in the provided array
 * This can be called either as standalone function or
 * passed to Array.reduce()
 */
type kvp = {[s:number] : number};
export const mode = reducerOrFn(mockReducer<number>(a => {
    if (a.length == 0) return NaN;
    if (a.length == 1) return a[0];

    const counts =  a.reduce((p,c) => {
        p[c] = (p[c] || 0) + 1;
        return p;
    }, {} as kvp);

    const rankedByCount = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
    ;
    const modeAsString = rankedByCount[0][0];
    return parseFloat(modeAsString);
}));
export default mode;
