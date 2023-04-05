import { reducerOrFn } from "@admb/libutils/out/arrays";

/**
 * Returns the product of all elements in an Array
 * This can be called either as standalone function or
 * passed to Array.reduce()
 */
export const product = reducerOrFn((a:number,c:number) => a * c);
export default product;
