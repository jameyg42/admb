import { reducerOrFn } from "@metlife/appd-libutils/out/arrays";

/**
 * Returns the sum of all elements in an Array.
 * This can be called either as standalone function or
 * passed to Array.reduce()
 */
export const sum = reducerOrFn<number>((a,c) => a + c);
export default sum;
