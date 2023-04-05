import { reducerOrFn, atOnceReducer, sort } from "@admb/libutils/out/arrays";

/**
 * Returns the Nth percentile of all elements in an Array
 * This can be called either as standalone function or
 * passed to Array.reduce()
 */
export const percentile = (n:number) => reducerOrFn(atOnceReducer((a:number[]) => {
    a = sort(a);
    const i = Math.floor(a.length * n);
    return a[i];
}));

export default percentile;
