const axios = require("axios");
const url = require('url');
const cookie = require('tough-cookie').Cookie;

function login(baseURL, account, username, password) {
    return axios
        .post("/auth", new url.URLSearchParams({
            accountName: account,
            userName: username,
            password: Buffer.from(password).toString('base64')
        }).toString(), {
            baseURL,
            params: {
                action: 'login'
            }
        }).then(rsp => {
            const cookies = rsp.headers['set-cookie'].map(cookie.parse);
            return {
                jsessionid: cookies.find(c => c.key == 'JSESSIONID'),
                csrf: cookies.find(c => c.key == 'X-CSRF-TOKEN')
            };
        })
        .catch(err => {
            throw {status: err.response.status, message: err.message};
        });
}

module.exports = {
    login
}
