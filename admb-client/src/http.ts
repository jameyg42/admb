import { default as axios, AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { parse as parseCookie, Cookie } from 'tough-cookie';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';

export const REQUEST = Symbol("REQUEST");
export interface HttpCookie extends Cookie {}
export type HttpParams = {[key:string]:string};
export interface HttpResponse extends AxiosResponse{
    cookies: HttpCookie[]
};
export interface HttpConfig extends AxiosRequestConfig {
    cookies?: HttpCookie[]
};
export interface HttpError extends AxiosError{};
export interface Cancellable {
    cancel: Function;
}

// this should probably be more configurable on a per-controller-host basis, but for now
// just prevent service calls from overwhelming the controllers
const httpAgent  = new HttpAgent({keepAlive: true, maxSockets: 8});
const httpsAgent = new HttpsAgent({keepAlive: true, maxSockets: 8});


export class HttpClient {
    private http: AxiosInstance;
    private inflight = new Set<AbortController>();
    constructor(defaultOptions?:HttpConfig) {
        const mergedHeaders = Object.assign({
            'Accept': 'application/json, */*;q=0.8',
            'User-Agent' : 'libappdjs-client/2.0 (axios)'
        }, defaultOptions?.headers);

        const options = Object.assign({
            timeout: 30 * 1000,
            httpAgent,
            httpsAgent
        }, defaultOptions, {
            headers: mergedHeaders
        });
        this.http = axios.create(options);
    }
    /**
     * this both provides a way to interact directly with Axios, and also provides all the plumbing
     * for the stuff that HttpClient adds.
     * @param config 
     * @returns 
     */
    public request(config:HttpConfig):Cancellable&Promise<HttpResponse> {
        const abort = new AbortController();
        this.inflight.add(abort);
        config = Object.assign({}, config, {
            signal: abort.signal
        });
        if (config.cookies) {
            config.headers = Object.assign({
                'Cookie': config.cookies.map(c => c.cookieString()).join(';')
            }, config.headers);
        }
        const promise = this.http.request(config)
                        .then(rsp => {
                            const cookies = (rsp.headers['set-cookie'] || []).map(c => parseCookie(c)).filter(c => c !== undefined) as Cookie[];
                            const r:any= rsp;
                            r.cookies = cookies;
                            return r as HttpResponse;
                        })
                        .finally(() => {
                           this.inflight.delete(abort);
                        });
        const cancellable = promise as any;  // FIXME - how to do this correctly????
        cancellable.cancel = () => {abort.abort()};
        cancellable.cancel = () => {};
        return cancellable as Cancellable&Promise<HttpResponse>;
    }
    public get(path:string, params?:HttpParams, config?:HttpConfig):Cancellable&Promise<HttpResponse> {
        return this.request(Object.assign({
            method: 'GET',
            url: path,
            params
        }, config));
    }
    public post(path:string, data?:any, config?:HttpConfig):Cancellable&Promise<HttpResponse> {
        return this.request(Object.assign({
            method: 'POST',
            url: path,
            data
        }, config));
    }
    public put(path:string, data?:any, config?:HttpConfig):Cancellable&Promise<HttpResponse> {
        return this.request(Object.assign({
            method: 'PUT',
            url: path,
            data
        }, config));
    }
    public delete(path:string, params?:HttpParams, config?:HttpConfig):Cancellable&Promise<HttpResponse> {
        return this.request(Object.assign({
            method: 'DELETE',
            url: path,
            params
        }, config));
    };

    public cancelAll() {
        this.inflight.forEach(a => a.abort());
    }
}
