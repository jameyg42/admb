const axios = require('axios');

function generateResponse(rsp) {
    const r = rsp.data;
    r.fullResponse = () => rsp;
    return r;
}

function Client(session) {
    this.session = session;
    const config = JSON.parse(JSON.stringify(session)); // hacky clone
    Object.assign(config.headers, {
        'Accept': 'application/json',
        'Content-Type' : 'application/json'
    });
    config.timeout = 10 * 1000;
    this.http = axios.create(config);
}
Client.prototype.get = function(url, params) {
    return this.http.get(url, {params: params || {}}).then(generateResponse);
}
Client.prototype.post = function(url, data) {
    return this.http.post(url, data).then(generateResponse);
}
Client.prototype.delete = function(url, params) {
    return this.http.delete(url, {params:params || {}}).then(generateResponse);
}

const login = require('./login');
function open(arg) {
    if (arguments.length == 4) {
        arg = {
            baseURL: arguments[0],
            account: arguments[1],
            username: arguments[2],
            password: arguments[3]
        }
    }
    if (arg.account) {
        return login(arg.baseURL, arg.account, arg.username, arg.password).then(session => new Client(session));
    }
    return Promise.resolve(new Client(arg));
}

module.exports = {
    Client,
    open
}
