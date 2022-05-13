import {default as NodeCache} from 'node-cache';
import { Duration } from 'luxon';

export const defaults = {
    useClones: false
} as NodeCache.Options;

export type LoaderFn<T> = () => Promise<T>;
export class ReadThroughCache {
    cache:NodeCache;
    constructor(options?:NodeCache.Options) {
        this.cache = new NodeCache(Object.assign({}, defaults, options));
    }
    get<T>(key:NodeCache.Key, loader:LoaderFn<T>, ttl?:Duration|number):Promise<T> {
        const v = this.cache.get(key) as T;
        if (v) {
            return Promise.resolve(v);
        }
        return loader().then((v:T) => {
            this.cache.set(key, v, ttl instanceof Duration ? ttl.as('seconds') : ttl || 0);
            return v;
        });
    }
}

export const Cache = NodeCache;
