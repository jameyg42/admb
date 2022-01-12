import { reducerOrFn, mockReducer } from "@metlife/appd-libutils/out/arrays";
import { sum } from "./sum";
/**
 * Returns the average of all elements in an Array
 * This can be called either as standalone function or
 * passed to Array.reduce()
 */
export const mean = reducerOrFn(mockReducer<number>(a => sum(a) / a.length));
export const avg = mean;
export default mean;
