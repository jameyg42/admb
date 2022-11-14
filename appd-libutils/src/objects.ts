/**
 * performs a deep clone of the enumerable properties of a given object.
 * Currently this is only intended to be used for "data objects", using
 * JSON stringify+parse to do the clone.
 * @param o
 * @returns 
 */
export function clone<T>(o:T):T {
    return JSON.parse(JSON.stringify(o)) as T;
}

/**
 * merges (shallow) the enumerable properties of each source object into a new object.
 * Shortcut for Object.assign({}, ...sources)
 * @param sources
 */
export function merge(...sources:any) {
    return Object.assign({}, ...sources);
}

// typeof short?cuts
export const is = (what:('string'|'number'|'bigint'|'boolean'|'array'|'object')) => (o:any) => typeof o === what;
export const isArray = is('array');
export const isString = is('string');
export const isBoolean = is('boolean');
export const isNumber = (o:any) => (is('number')(o) || is('bigint')(o));
export const isValidNumber = (o:any) => isNumber(o) && !isNaN(o);

export const asNumber = (o?:any) => isNumber(o) ? o as number : o ? parseFloat(o.toString()) : o;
export const asBoolean = (o?:any) => {
    if (isBoolean(o)) return o as boolean;
    if (!o) return undefined;
    const isTrue = o.toString().toLowerCase() === 'true';
    const isFalse = o.toString().toLowerCase() === 'false';
    return isTrue || isFalse ?  isTrue : undefined;
}

export const has = (o:any) => o !== null && o !== undefined && (isNumber(o) && !isNaN(o));
export const exists = has;
export const isTrue = (o:any) => asBoolean(o) === true;
export const not = (a:any)  => !asBoolean(a);

export function coalesce<T>(...o:T[]):T|undefined {
    return o.find(exists);
}
