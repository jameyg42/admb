import { Cancellable, HttpClient, HttpParams } from "./http";
import { default as login } from './login';

export class Session {
    constructor(public readonly url:string, public readonly account:string, public readonly sessionId: string, public readonly csrf: string) {}
    
    static deserialize(session:string): Session {
        const b64 = Buffer.from(session, 'base64');
        const attribs = JSON.parse(b64.toString('ascii'));
        return new Session(attribs.url, attribs.act, attribs.sid, attribs.xrf);
    }
    serialize(): string {
        const b64 = Buffer.from(JSON.stringify({url: this.url, act: this.account, sid: this.sessionId, xrf: this.csrf})).toString('base64');
        return b64;
    }
}

export class Client {
    private client: HttpClient;
    constructor(public readonly session:Session) {
        this.client = new HttpClient({
            baseURL: session.url,
            headers: {
                'X-CSRF-TOKEN' : session.csrf,
                'Cookie': `JSESSIONID=${session.sessionId};X-CSRF-TOKEN=${session.csrf}`
            }
        });
    }
    public get<T>(path:string, params?:HttpParams):Cancellable&Promise<T> {
        const rsp = this.client.get(path, params);
        const data:any = rsp.then(rsp => rsp.data);
        data.cancel = rsp.cancel;
        return data as Cancellable&Promise<T>;
    }
    public post<T>(path:string, body:any, params?:HttpParams):Cancellable&Promise<T> {
        const rsp = this.client.post(path, body, {params});
        const data:any = rsp.then(rsp => rsp.data);
        data.cancel = rsp.cancel;
        return data as Cancellable&Promise<T>;
    }
    public put<T>(path:string, body:any, params?:HttpParams):Cancellable&Promise<T> {
        const rsp = this.client.put(path, body, {params});
        const data:any = rsp.then(rsp => rsp.data);
        data.cancel = rsp.cancel;
        return data as Cancellable&Promise<T>;
    }
    public delete<T>(path:string, params?:HttpParams):Cancellable&Promise<T> {
        const rsp = this.client.delete(path, params);
        const data:any = rsp.then(rsp => rsp.data);
        data.cancel = rsp.cancel;
        return data as Cancellable&Promise<T>;
    }
    public cancelAll() {
        this.client.cancelAll();
    }

    static create(session:Session|Promise<Session>):&Promise<Client> {
        return session instanceof Session 
            ? Promise.resolve(new Client(session)) 
            : session.then(s => new Client(s));
    }
    static reopen(session:string):Client {
        return new Client(Session.deserialize(session));
    }
    static open(url:string, account:string, username:string, password:string):Promise<Client> {
        // TODO we need a way to force the use of Local logins, ignoring the configured default login provider.
        // For now, if the username specifies a domain in the username, we'll use domain matching account to
        // indicate local logins
        const {user,domain} = (/^(?<user>.*)(?:@(?<domain>.*))$/.exec(username)?.groups || {user: username, domain: undefined}) as any;
        let method = undefined;
        if (domain && domain === account) {
            method = 'local';
            username = user;
        }

        return login(url, account, username, password, method)
            .then(session => new Client(session));
    }
}
