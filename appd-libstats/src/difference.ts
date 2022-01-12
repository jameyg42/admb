import { reducerOrFn } from "@metlife/appd-libutils/out/arrays";

/**
 * Returns the difference of all elements in an Array. 
 * This can be called either as standalone function or
 * passed to Array.reduce().
 * NOTE that when called as a standalone function, this
 * simply calls reduce() without an initial value, meaning
 * the starting point for the subtractions is the first 
 * element of the array.  
 * 
 */
export const difference = reducerOrFn<number>((a,c) => a - c);
export default difference;
