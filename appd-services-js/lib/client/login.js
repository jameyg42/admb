const axios = require("axios");

function getLoginMethod(baseURL, account) {
    return axios
        .get(`/public-info?action=query-security-provider&account-name=${account}`,{baseURL})
        .then(rsp => rsp.data.trim());
}

function login(baseURL, account, username, password) {
    return getLoginMethod(baseURL, account)
    .then(method => {
        try {
            const provider = require(`./login-providers/${method.toLowerCase()}`);
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

module.exports = login;
