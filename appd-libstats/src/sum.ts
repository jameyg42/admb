import { reducerOrFn } from "@metlife/appd-libutils";

/**
 * Returns the sum of all elements in an Array.
 * This can be called either as standalone function or
 * passed to Array.reduce()
 */
export const sum = reducerOrFn((a:number,c:number) => a + c);
export default sum;
