import { HttpClient } from '../http';
import { URLSearchParams } from 'url';
import { LoginProvider, SessionIds } from './spi';

export class LDAPLoginProvider implements LoginProvider {
    login(baseURL:string, account:string, username:string, password:string):Promise<SessionIds> {
        const http = new HttpClient({baseURL});
        return http
        .post("/auth?action=login", new URLSearchParams({
                accountName: account,
                userName: username,
                password: Buffer.from(password).toString('base64')
            })
        )
        .then(rsp => {
            const jsessionid = rsp.cookies.find(c => c.key == 'JSESSIONID');
            const csrf = rsp.cookies.find(c => c.key == 'X-CSRF-TOKEN');
            if (jsessionid && csrf) {
                return {
                    jsessionid: jsessionid.value,
                    xcsrf: csrf.value
                } as SessionIds;
            } else {
                throw {status:499, message:'unknown error'}
            }
        })
        .catch(err => {
            if (err.response) {
                throw {status: err.response.status, message: err.message};
            } else {
                throw err;
            }
        });
    }
}

export default LDAPLoginProvider;
