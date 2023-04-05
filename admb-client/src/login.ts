import { Session } from './client';
import { HttpClient } from './http';
import LDAPLoginProvider from './login-providers/ldap';
import LocalLoginProvider from './login-providers/local';
import { LoginProviderRegistry } from './login-providers/registry';

// this almost certainly isn't the best way to handle "pluggable" login providers, but 
// it'll work short-term
export const defaultRegistry = new LoginProviderRegistry({
    'ldap': new LDAPLoginProvider(),
    'local': new LocalLoginProvider()
 });
 

export class LoginService {
    constructor(private providers:LoginProviderRegistry=defaultRegistry) {}
    login(url:string, account:string, username:string, password:string):Promise<Session> {
        const [,domain] = username.split('@');
        let method = domain && domain == account ? 'local': undefined;

        const http = new HttpClient({baseURL:url});
        return (method 
            ? Promise.resolve(method) 
            : http.get(`/public-info?action=query-security-provider&account-name=${account}`)
            .then(rsp => rsp.data.trim())
        )
        .then(method => this.providers.lookup(method))
        .then(loginProvider => loginProvider.login(url, account, username, password))
        .then(sessionIds => {
            return new Session(url, account, sessionIds.jsessionid, sessionIds.xcsrf);
        });
    }
}