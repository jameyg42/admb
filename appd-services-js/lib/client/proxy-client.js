const axios = require("axios");
const _login = require("./login");
const merge = require('lodash').merge;


function login(baseUrl, account, uid, pwd, storage) {
    return _login.openSession(baseUrl, account, uid, pwd)
        .then((session) => serialize(session, storage));
}
const STORAGE_KEY = "APPDSESSION";
function serialize(session, storage) {
    storage(STORAGE_KEY, Buffer.from(JSON.stringify(session)).toString('base4'));
}
function deserialize(storage) {
    return JSON.parse(Buffer.from(storage(STORAGE_KEY), 'base64').toString('ascii'));
}

function open(storageOrSession) {
    const session = storageOrSession.baseURL ? storageOrSession : deserialize(storageOrSession);
    const req = _login.createRequestForSession(session);

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
