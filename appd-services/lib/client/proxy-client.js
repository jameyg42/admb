const axios = require("axios");
const tough = require("tough-cookie");
const cookie = tough.Cookie;


const STORAGE_KEY = "APPDSESSION";

function login(baseUrl, uid, pwd, storage) {
    return axios
        .get("/auth?action=login", {
            baseURL: baseUrl,
            auth: {
                username: uid.endsWith("@customer1") ? uid : `${uid}@customer1`,
                password: pwd,
            },
        })
        .then((loginResponse) => {
            const cookies = loginResponse.headers["set-cookie"].map(cookie.parse);
            const csrfToken = cookies.find((c) => c.key == "X-CSRF-TOKEN").value;
            const jSession = cookies.find((c) => c.key == "JSESSIONID").value;

            const session = Buffer.from(
                JSON.stringify({
                    baseUrl,
                    jSession,
                    csrfToken,
                })
            ).toString("base64");
            storage(STORAGE_KEY, session);

            return {
                baseUrl,
                jSession,
                csrfToken,
                session,
            };
        });
}

function open(storageOrSession) {
    const session = storageOrSession[STORAGE_KEY] || storageOrSession;
    const r = JSON.parse(Buffer.from(session, 'base64').toString('ascii'));
    const req = axios.create({
        baseURL: r.baseUrl,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': r.csrfToken,
            'Cookie': `JSESSIONID=${r.jSession}`
        }
    });
    const get = function (url, params) {
        return req.get(url, { params: params || {} }).then(rsp => rsp.data);
    }
    const post = function (url, data) {
        return req.post(url, data).then(rsp => rsp.data);
    }
    const info = function () {
        return get('/restui/user/getUser').then(user => ({
            controller: r.baseUrl,
            account: user
        }));
    }

    return {
        get, post, info,
        con: {
            url: r.baseUrl,
            uid: '<unset>',
            pwd: '<unset>'
        }
    }
}

module.exports = {
    login: login,
    open: open
}