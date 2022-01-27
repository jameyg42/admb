import { HttpClient, HttpParams } from '../http';
import { URL, URLSearchParams } from 'url';
import { HTMLElement, parse as htmlParse} from 'node-html-parser';
import { Cookie } from 'tough-cookie';
import { LoginProvider, SessionIds } from './spi';


function http(baseURL?:string) {
    return baseURL ? new HttpClient({baseURL}) : new HttpClient();
}

function createAuthnSAMLRequest(baseURL:string, account:string):Promise<any> {
    // the get-saml-auth-request action will generate a URL to the MetLife SAML endpoint, but
    // that URL cannot be directly GET or POSTed.  Instead, we need to "move" the SAMLRequest
    // and RelayState from the QueryString to the POST body.
    const requestedUrl = new URL(`/controller/?accountName=${account}#/location=HOME_FREQUENTLY_VISITED`, baseURL);
    return http(baseURL).get('/saml-auth', {
            'action':'get-saml-auth-request-info',
            'account-name' : account,
            'requested-url' : Buffer.from(requestedUrl.toString()).toString('base64')
    })
    .then(rsp => rsp.data)
    .then(rsp => {
        const getRequest = new URL(rsp);
        // need to figure out if this is GET or POST
        return http(baseURL).get('/public-info', {
                'action': 'query-saml-http-method',
                'account-name': account
        })
        .then(method => method.data?.trim())
        .then(method => {
            if (method == 'post') {
                return {
                    method,
                    url: new URL(getRequest.pathname, getRequest).toString(),
                    data: new URLSearchParams({
                        SAMLRequest: getRequest.searchParams.get('SAMLRequest') || 'error-missing-samlrequest',
                        RelayState: getRequest.searchParams.get('RelayState') || ''
                    }),
                    params: {
                        SPID: getRequest.searchParams.get('SPID')
                    }
                }
            } else if (method == 'get') {
                return {
                    method,
                    url: getRequest.toString()
                }
            } else {
                throw {status: 500, message: `unknown SAML method ${method}`};
            }
        })
    })
}
function postUnauthorizedAuthnSAMLRequestRedirectToSMLogin(authnRequest:HttpParams):any {
    // the initial GET|POST to the MetLife SAML entry point won't have an SMSESSION meaning
    // we'll be redirected to a Login page.  But we can't let Axios follow those redirects
    // automatically because we need to capture the GUID cookie the initial hit to the 
    // entry point generates
    return http().request(Object.assign({
        maxRedirects: 0,
        validateStatus: function (status:any) {
            return status == 302;
        }
    }, authnRequest))
    .then(rsp => {
        const location = rsp.headers['location'];
        const sm = new URL(location);
        return http().get(location)
        .then(rsp => ({
            html: rsp.data,
            baseURL: `${sm.protocol}//${sm.host}${rsp.request.path}`,
            ssoGuid: rsp.cookies.find(c => c.key == 'GUID')
        }));
    })
}
function smLoginAndRedirectBackToAuthnSAMLRequest(uid:string, pwd:string):(s:any)=>Promise<any> {
    return (loginRedirect:any) => {
        // use the form in the login page we redirect to to perform an SM login.
        // this will establish the SMSESSION needed to (re)call the initial
        // SAMLRequest entry point which we'll end up back on by following the 
        // SM TARGET redirects.  NOTE that we only need SMSESSION for the 
        // saml2sso URL so we won't need to persist it outside of this 
        // redirect sequence
        const root = htmlParse(loginRedirect.html);
        const form = root.querySelector('form#LoginForm') as HTMLElement;
        const inputs =  Object.fromEntries(
            root.querySelectorAll('form#LoginForm input')
            .map(input => ([input.attributes.name, input.attributes.value]))
        );
        inputs.USER = `${uid}@metnet`;
        inputs.PASSWORD = pwd;

        const submit = new URL(form.attributes.action, loginRedirect.baseURL);
        return http().post(submit.toString(), new URLSearchParams(inputs), {
            maxRedirects: 0,
            validateStatus: function (status:number) {
                return status == 302;
            }
        })
        .then(rsp => {
            // we only need the SMSESSION set-cookie, but grab and forward them all
            // we also need to add the GUID cookie back
            const location = rsp.headers['location'];
            if (loginRedirect.ssoGuid) {
                rsp.cookies.push(loginRedirect.ssoGuid);
            }

            return http().get(location, undefined, {
                cookies: rsp.cookies
            })
            .then(rsp => rsp.data);
        })
        .catch(err => {
            if (err.response) {
                if (err.response.status == 200) {
                    throw {status: 499, message: 'invalid login'};
                } else {
                    throw {status: err.response.status, message: err.message};
                }
            } else {
                throw err;
            }
        })
    };
}
function handleAuthnSAMLResponseAutoSubmit(samlRedirectPage:string):any {
    // the SMLogin will redirect back to the original URL used to 
    // POST the unauthorized AuthnRequest to.  The response to that
    // request is an HTML form that is auto-submitted via javascript.
    // So simulate that auto-submit here, and grab the resulting
    // JSESSIONID cookie that we'll need for all future client
    // requests
    const root = htmlParse(samlRedirectPage);
    const form = root.querySelector('form') as HTMLElement;
    const inputs = Object.fromEntries(
                    root.querySelectorAll('form input')
                    .map(input => ([input.attributes.name, input.attributes.value]))
                    );
    
    return http().post(form.attributes.action, new URLSearchParams(inputs), {
        maxRedirects: 0,
        validateStatus: function (status:number) {
            return status == 302;
        }
    })
    .then(rsp => {
        return rsp.cookies.find(c => c.key == 'JSESSIONID');
    })
}
function doFinalAuthToGetCSRF(baseURL:string):(c:Cookie)=>Promise<SessionIds> {
    // we also need an X-CSRF-TOKEN to make calls, which we can get
    // by calling the "auth" endpoint - because we already have a valid
    // JSESSIONID, "auth action=login" will simply respond with a 
    // X-CSRF-TOKEN set-cookie
    return (jsessionid:Cookie) => {
        return http(baseURL).get('/auth', {
                action: 'login'
            },{
            cookies: [jsessionid]
        })
        .then(rsp => {
            const csrf = rsp.cookies.find(c => c.key == 'X-CSRF-TOKEN');
            if (csrf && jsessionid) {
                return {
                    jsessionid: jsessionid.value,
                    xcsrf: csrf.value
                }
            } else {
                throw {status: 499, message: 'unknown error during login'};
            }
        });
    };
}
export class SAMLLoginProvider implements LoginProvider {
    login(baseURL:string, account:string, username:string, password:string):Promise<SessionIds> {
        return createAuthnSAMLRequest(baseURL, account)
        .then(postUnauthorizedAuthnSAMLRequestRedirectToSMLogin)
        .then(smLoginAndRedirectBackToAuthnSAMLRequest(username, password))
        .then(handleAuthnSAMLResponseAutoSubmit)
        .then(doFinalAuthToGetCSRF(baseURL))
    }
}
export default SAMLLoginProvider;
