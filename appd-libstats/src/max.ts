import { reducerOrFn } from "@metlife/appd-libutils/out/arrays";

/**
 * Returns the maximum of all elements in an Array
 * This can be called either as standalone function or
 * passed to Array.reduce()
 */
export const max = reducerOrFn((a:number,c:number) => Math.max(a, c));
export default max;
