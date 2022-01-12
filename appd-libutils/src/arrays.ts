/* Copyright 2022 Metropolitan Life Insurance Company, All Rights Reserved */

/**
 * Tests if an object is an Array.  This is just a shortcut to Array.isArray().
 * @param o 
 * @returns 
 */
export function isArray(o:any) {
    return Array.isArray(o);
}
export type ReducerOrFn<T> = (p:T|Array<T>, c?:T, i?:number, a?:Array<T>) => T;
export type ReducerFn<T> = (p:T, c:T, i:number, a:Array<T>) => T;
export type MockReducerFn<T> = (a:Array<T>, initialValue?:T) => T;

/**
 * Utility for creating a function that can be called either as an Array reducer
 * or a function that processes an Array.  e.g.
 *   sum = reducerOrFn((a,c) => a+c);
 * can be called either as
 *   [1,2,3].reduce(sum);
 * or
 *   sum([1,2,3]);
 */
export function reducerOrFn<T>(fn:ReducerFn<T>, defaultInitial?:T):ReducerOrFn<T> {
    return (pOrArray:T|Array<T>, c?:T, i?:number, a?:Array<T>) => {
        if (isArray(pOrArray)) {
            const arr = pOrArray as Array<T>;
            if (defaultInitial) {
                return arr.reduce(fn, defaultInitial);
            } else {
                return arr.reduce(fn);
            }
        }
        const p = pOrArray as T;
        return fn(p, c as T, i as number, a as Array<T>);
    }
}

/**
 * a reducer factory that produces a reducer Fn that processes an entire array 
 * at once vs an element at a time.  Array.reduce() has the characteristic that it 
 * produces a single result from the given array - but it does so in the specific 
 * fashion of  processing each array element one at a time relative to an accumulator.
 * Some reductions to a single value cannot be processed in such a way, however.
 * This utilty creates a reducer that will basically process the entire array
 * at index=0 and bubble the result through the rest of the reducer calls.
 * @param fn 
 */
export function mockReducer<T>(fn:MockReducerFn<T>):ReducerFn<T> {
    return (p:T, c:T, i:number, a:Array<T>) => {
        return i == a.length-1 ? fn(a) : p;
    }
}

/**
 * a reducer factory that produces a reducer that operates with a specific initial
 * value.  Certain reducers require a specific initial value, but it's not effective
 * to require the caller to provide that initial value when calling reduce() 
 */
export function reducerWithFixedInitial<T>(initialValue:T, fn:ReducerFn<T>): ReducerFn<T> {
    return (p:T, c: T, i: number, a:Array<T>) => {
        if (i == 0) { // unexpected - a user-supplied initial value was provided, but ignore it
            return initialValue;
        } else if (i == 1) {
            // process both array element=0 and the current element at once
            return fn(fn(initialValue, a[0], 0, a), c, i, a);
        } else {
            return fn(p, c, i, a);
        }
    }
}


export type ComparatorFn<T> = (a:T, b:T) => number;
/**
 * array sort, preserving initial array
 * @param a 
 * @param desc 
 * @returns 
 */
export const sort = <T>(a:Array<any>, comparator?:ComparatorFn<T>) => {
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
 * zips up 
 * @param arrays
 * @returns 
 */
export const zip = (...arrays:Array<any[]>) => {
    const zipped = [];
    const maxLen = Math.max(...arrays.map(a => a.length));
    
    for (let i = 0; i < maxLen; i++) {
        const e = arrays.map(a => a[i]);
        zipped.push(e);
    }
    return zipped;
}
