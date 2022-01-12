import { reducerOrFn } from "@metlife/appd-libutils/out/arrays";

/**
 * Returns the maximum of all elements in an Array
 * This can be called either as standalone function or
 * passed to Array.reduce()
 */
export const max = reducerOrFn<number>((a,c) => Math.max(a, c));
export default max;
