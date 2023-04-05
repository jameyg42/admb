/* Copyright 2022 Metropolitan Life Insurance Company, All Rights Reserved */

/**
 * Tests if an object is an Array.  This is just a shortcut to Array.isArray().
 * @param o 
 * @returns 
 */
export function isArray(o:any) {
    return Array.isArray(o);
}
//export type ReducerFn<T> = (p:T, c:T, i?:number, a?:T[]) => T;
export type ReducerFn<R,T> = (p:R, c:T, i?:number, a?:T[]) => R;
export type ReducerOrFn<R,T> = (p:R|T[], c?:T, i?:number, a?:T[]) => R;

/**
 * Utility for creating a function that can be called either as an Array reducer
 * or a function that processes an Array.  e.g.
 *   sum = reducerOrFn((a,c) => a+c);
 * can be called either as
 *   [1,2,3].reduce(sum);
 * or
 *   sum([1,2,3]);
 */
export function reducerOrFn<R,T>(fn:ReducerFn<R,T>, defaultInitial?:R):ReducerOrFn<R,T> {
    return (pOrArray:R|T[], c?:T, i?:number, a?:T[]) => {
        if (isArray(pOrArray) && c === undefined) {
            const arr = pOrArray as T[];
            let r = defaultInitial ? arr.reduce(fn, defaultInitial) : arr.reduce(fn as any);
            return r as R;
        } else {
            return fn(pOrArray as R, c as T, i, a);
        }
    }
}

/**
 * a reducer factory that produces a reducer Fn that processes an entire array 
 * at once vs an element at a time.  Array.reduce() has the characteristic that it 
 * produces a single result from the given array - but it does so by processing each 
 * array element one at a time relative to an accumulator.  Some reductions to a single 
 * value cannot be processed in such a way, however, but we still might want to perform
 * the reduction in a functional way.
 * This utilty creates a reducer that will basically process the initial value until the
 * last array element, and then will process everything at once.
 * @param fn 
 */
export function atOnceReducer<R,T>(fn:AtOnceReducerFn<R,T>):ReducerFn<R,T> {
    const x = (p:R, c:T, i:number, a:T[]) => {
        return i == a.length-1 ? fn(a, p) : p;
    }
    return x as ReducerFn<R,T>;
}
export type AtOnceReducerFn<R,T> = (a:T[], initialValue?:R) => R;

/**
 * a reducer factory that produces a reducer that operates with a specific initial
 * value.  Certain reducers require a specific initial value, but it's not effective
 * to require the caller to provide that initial value when calling reduce() 
 */
export function reducerWithFixedInitial<R,T>(initialValue:R, fn:ReducerFn<R,T>): ReducerFn<R,T> {
    const x = (p:R, c: T, i: number, a:T[]) => {
        if (i == 0) { // unexpected - a user-supplied initial value was provided, but ignore it
            return initialValue;
        } else if (i == 1) {
            // process both array element=0 and the current element at once
            return fn(fn(initialValue, a[0], 0, a), c, i, a);
        } else {
            return fn(p, c, i, a);
        }
    } 
    return x as ReducerFn<R,T>;
}


export type ComparatorFn<T> = (a:T, b:T) => number;
/**
 * array sort, preserving initial array
 * @param a 
 * @param desc 
 * @returns 
 */
export const sort = <T>(a:T[], comparator?:ComparatorFn<T>) => {
    const clone = a.slice();
    return comparator ? clone.sort(comparator) : clone.sort();
}

export const compareAscending:ComparatorFn<number> = (a:number, b:number) => a - b;
export const compareDescending:ComparatorFn<number> = (a:number, b:number) => b - a;

/**
 * numeric array sort, preserving initial array
 * @param a 
 * @param desc 
 * @returns 
 */
export const nsort = (a:number[], desc?:boolean): number[] => {
    return sort(a, desc ? compareDescending : compareAscending);
}

/**
 * zips up a list of arrays - that is, create a new set of arrays where each array
 * contains the element from each input array with the same index.  For example, 
 * zip([1,2,3], [a,b,c]) produces [1,a], [2,b], [3,c].  
 * @param arrays
 * @returns 
 */
 export const zip = <T extends unknown[][]>( ...arrays: T )
 : { [K in keyof T]: T[K] extends (infer V)[] ? V : never }[] => // no idea why this works
 {
    const zipped = [];
    const maxLen = Math.max(...arrays.map(a => a.length));
    
    for (let i = 0; i < maxLen; i++) {
        const e = arrays.map(a => a[i]);
        zipped.push(e);
    }
    // @ts-expect-error
    return zipped;
}

/**
 * zip as a reducer - FIXME need to figure out how to allow reducerOrFn/atOnceReducer to take
 * varargs instead of an array.
 */
// @ts-expect-error FIXME 
export const zipReduce = atOnceReducer(arrays => zip(...arrays));

export const removeGapsFilterFn = (v:any) => v === null || v === undefined;
export const removeGaps = (a:any[]) => a.filter(removeGapsFilterFn);
