import { Session } from './client';
import { HttpClient } from './http';
import { LoginProvider } from './login-providers/spi';
import { LDAPLoginProvider } from './login-providers/ldap';
import { SAMLLoginProvider } from './login-providers/saml';

const providers = {
    'saml': SAMLLoginProvider,
    'ldap': LDAPLoginProvider
} as any;


function login(url:string, account:string, username:string, password:string):Promise<Session> {
    const http = new HttpClient({baseURL:url});
    return http
    .get(`/public-info?action=query-security-provider&account-name=${account}`)
    .then(rsp => rsp.data.trim())
    .then(method => {
        try {
            const Provider = providers[method.toLowerCase()];
            return new Provider() as LoginProvider;
        } catch (e) {
            console.error(e);
            throw new Error(`no provider found for method ${method}`)
        }
    })
    .then(loginProvider => loginProvider.login(url, account, username, password))
    .then(sessionIds => {
        return new Session(url, account, sessionIds.jsessionid, sessionIds.xcsrf);
    });
}

export default login;
