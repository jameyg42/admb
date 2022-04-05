const axios = require('axios');
const url = require('url');
const html = require('node-html-parser');
const cookie = require('tough-cookie').Cookie;

function createAuthnSAMLRequest(baseURL, account) {
    // the get-saml-auth-request action will generate a URL to the MetLife SAML endpoint, but
    // that URL cannot be directly GET or POSTed.  Instead, we need to "move" the SAMLRequest
    // and RelayState from the QueryString to the POST body.
    return axios.get('/saml-auth', {
        baseURL,
        params: {
            'action':'get-saml-auth-request-info',
            'account-name' : account,
            'requested-url' : 'aHR0cHM6Ly9tbC1ub25wcm9kLnNhYXMuYXBwZHluYW1pY3MuY29tL2NvbnRyb2xsZXIvP2FjY291bnROYW1lPW1sLW5vbnByb2QjL2xvY2F0aW9uPUFQUFNfQUxMX0RBU0hCT0FSRCZ0aW1lUmFuZ2U9bGFzdF8xX2hvdXIuQkVGT1JFX05PVy4tMS4tMS42MA=='
        }
    })
    .then(rsp => {
        const getRequest = new url.URL(rsp.data);
        return {
            method: 'post',
            url: new url.URL(getRequest.pathname, getRequest).toString(),
            data: new url.URLSearchParams({
                SAMLRequest: getRequest.searchParams.get('SAMLRequest'),
                RelayState: getRequest.searchParams.get('RelayState')
            }).toString(),
            params: {
                SPID: getRequest.searchParams.get('SPID')
            }
        }
    });
}
function postUnauthorizedAuthnSAMLRequestRedirectToSMLogin(authnRequest) {
    // the initial POST to the MetLife SAML entry point won't have an SMSESSION meaning
    // we'll be redirected to a Login page.  But we can't let Axios follow those redirects
    // automatically because we need to capture the GUID cookie the initial hit to the 
    // entry point generates
    return axios.request(Object.assign({
        maxRedirects: 0,
        validateStatus: function (status) {
            return status == 302;
        }
    }, authnRequest))
    .then(rsp => {
        const location = rsp.headers['location'];
        const cookies = rsp.headers['set-cookie'].map(cookie.parse);
        return axios.get(location)
        .then(rsp => ({
            html: rsp.data,
            baseURL: `${rsp.request.protocol}//${rsp.request.host}${rsp.request.path}`,
            ssoGuid: cookies.find(c => c.key == 'GUID')
        }));
    });
}
function smLoginAndRedirectBackToAuthnSAMLRequest(uid, pwd) {
    return (loginRedirect) => {
        // use the form in the login page we redirect to to perform an SM login.
        // this will establish the SMSESSION needed to (re)call the initial
        // SAMLRequest entry point which we'll end up back on by following the 
        // SM TARGET redirects.  NOTE that we only need SMSESSION for the 
        // saml2sso URL so we won't need to persist it outside of this 
        // redirect sequence
        const root = html.parse(loginRedirect.html);
        const form = root.querySelector('form#LoginForm');
        const inputs =  Object.fromEntries(
            root.querySelectorAll('form#LoginForm input')
            .map(input => ([input.attributes.name, input.attributes.value]))
        );
        inputs.USER = `${uid}@metnet`;
        inputs.PASSWORD = pwd;

        const submit = new url.URL(form.attributes.action, loginRedirect.baseURL);
        return axios.post(submit.toString(), new url.URLSearchParams(inputs).toString(), {
            maxRedirects: 0,
            validateStatus: function (status) {
                return status == 302;
            }
        })
        .then(rsp => {
            // we only need the SMSESSION set-cookie, but grab and forward them all
            // we also need to add the GUID cookie back
            const location = rsp.headers['location'];
            const cookies = rsp.headers['set-cookie'].map(cookie.parse);
            cookies.push(loginRedirect.ssoGuid);

            return axios.get(location, {
                headers: {
                    'Cookie': cookies.map(c => c.cookieString()).join(';')
                }
            })
            .then(rsp => rsp.data);
        });
    };
}
function handleAuthnSAMLResponseAutoSubmit(samlRedirectPage) {
    // the SMLogin will redirect back to the original URL used to 
    // POST the unauthorized AuthnRequest to.  The response to that
    // request is an HTML form that is auto-submitted via javascript.
    // So simulate that auto-submit here, and grab the resulting
    // JSESSIONID cookie that we'll need for all future client
    // requests
    const root = html.parse(samlRedirectPage);
    const form = root.querySelector('form');
    const inputs = Object.fromEntries(
                    root.querySelectorAll('form input')
                    .map(input => ([input.attributes.name, input.attributes.value]))
                    );
    
    return axios.post(form.attributes.action, new url.URLSearchParams(inputs).toString(), {
        maxRedirects: 0,
        validateStatus: function (status) {
            return status == 302;
        }
    })
    .then(rsp => {
        const cookies = rsp.headers['set-cookie'].map(cookie.parse);
        return cookies.find(c => c.key == 'JSESSIONID');
    });
}
function doFinalAuthToGetCSRF(baseURL) {
    // we also need an X-CSRF-TOKEN to make calls, which we can get
    // by calling the "auth" endpoint - because we already have a valid
    // JSESSIONID, "auth action=login" will simply respond with a 
    // X-CSRF-TOKEN set-cookie
    return (jsessionid) => {
        return axios.get('/auth', {
            baseURL,
            params: {
                action: 'login'
            },
            headers: {
                Cookie: jsessionid.cookieString()
            }
        })
        .then(rsp => {
            const cookies = rsp.headers['set-cookie'].map(cookie.parse);
            return {
                jsessionid,
                csrf: cookies.find(c => c.key == 'X-CSRF-TOKEN')
            };
        });
    };
}
function login(baseURL, account, username, password) {
    return createAuthnSAMLRequest(baseURL, account)
    .then(postUnauthorizedAuthnSAMLRequestRedirectToSMLogin)
    .then(smLoginAndRedirectBackToAuthnSAMLRequest(username, password))
    .then(handleAuthnSAMLResponseAutoSubmit)
    .then(doFinalAuthToGetCSRF(baseURL))
}

module.exports = {
    login
}
