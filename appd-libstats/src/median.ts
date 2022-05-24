import { reducerOrFn, atOnceReducer, nsort } from "@metlife/appd-libutils";

/**
 * Returns the median of all numbers in the provided array
 * This can be called either as standalone function or
 * passed to Array.reduce()
 */
export const median = reducerOrFn(atOnceReducer((a:number[]) => {
    if (a.length < 2) return a[0];

    a = nsort(a);
    const midpoint = Math.floor(a.length / 2);
    if (a.length % 2 == 0) { //[2,4,6,8] mp=2 := 6
        return (a[midpoint-1] + a[midpoint]) / 2;
    }
    return a[midpoint]; // [1,2,3] mp=floor(1.5)=1 := 2
}));
export default median;
