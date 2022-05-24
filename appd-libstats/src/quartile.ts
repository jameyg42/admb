import { reducerOrFn, atOnceReducer, sort } from "@metlife/appd-libutils";
import { median } from "./median";

/**
 * Returns the quartiles of all elements in an Array.
 * This can be called either as standalone function or
 * passed to Array.reduce()
 */
export const quartiles = (a:number[]) => { // FIXME fix types to allow reducer utils to return a different type
    const sorted = sort(a);
    const lower = sorted.slice(0, Math.floor(sorted.length / 2));
    const upper = sorted.slice(Math.ceil(sorted.length / 2));
    const q1 = median(lower);
    const q2 = median(sorted);
    const q3 = median(upper);

    return [q1,q2,q3];    
};
export default quartiles;

export const iqr = reducerOrFn(atOnceReducer((a:number[]) => {
    const [q1,q2,q3] = quartiles(a);
    return q3 - q1;
}));
