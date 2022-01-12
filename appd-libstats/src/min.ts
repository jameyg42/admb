import { reducerOrFn } from "@metlife/appd-libutils/out/arrays";

/**
 * Returns the minimum of all elements in an Array
 * This can be called either as standalone function or
 * passed to Array.reduce()
 */
export const min = reducerOrFn<number>((a,c) => Math.min(a, c));
export default min;
