import { Session } from './client';
import { HttpClient } from './http';
import { LoginProvider } from './login-providers/spi';

function login(url:string, account:string, username:string, password:string):Promise<Session> {
    const http = new HttpClient({baseURL:url});
    return http
    .get(`/public-info?action=query-security-provider&account-name=${account}`)
    .then(rsp => rsp.data.trim())
    .then(method => {
        try {
            const Provider = require(`./login-providers/${method.toLowerCase()}`).default;
            return new Provider() as LoginProvider;
        } catch (e) {
            throw new Error(`no provider found for method ${method}`)
        }
    })
    .then(loginProvider => loginProvider.login(url, account, username, password))
    .then(sessionIds => {
        return new Session(url, account, sessionIds.jsessionid, sessionIds.xcsrf);
    });
}

export default login;
