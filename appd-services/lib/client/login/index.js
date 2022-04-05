const axios = require("axios");
const cookie = require("tough-cookie").Cookie;
const merge = require('lodash').merge;

function getLoginMethod(baseURL, account) {
    return axios
        .get(`/public-info?action=query-security-provider&account-name=${account}`,{baseURL})
        .then(rsp => rsp.data.trim());
}

function login(baseURL, account, username, password) {
    return getLoginMethod(baseURL, account)
    .then(method => {
        try {
            const provider = require(`./${method.toLowerCase()}`);
            return provider;
        } catch (e) {
            throw new Error(`no provider found for method ${method}`)
        }
    })
    .then(loginProvider => loginProvider.login(baseURL, account, username, password))
    .then(cookies => {
        return {
            baseURL,
            headers: {
                Cookie: Object.values(cookies).map(c => c.cookieString()).join(';'),
                'X-CSRF-TOKEN': cookies.csrf.value
            }
        }
    });
}

function createRequestForSession(session) {
    const headers = merge(session.headers, {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cookie': Object.entries(session.cookies).map(([k,v]) => `${k}=${v}`).join(';')
    });
    const req = axios.create({
        baseURL: session.baseUrl,
        headers
    });
    return req;
}

module.exports = {
    login,
}
