const axios = require('axios');
const tough = require('tough-cookie');
const cookie = tough.Cookie;

function adjustUrl(url) {
    // TODO try to intelligently add output=JSON
    return url;
}

function Client(con) {
    this.con = con;
}
Client.prototype._runWithRetry = function(f) {
    return f()
    .catch(err => {
        if (err.response.status === 401) {
            this.login().then(() => {
                return f();
            });
        } else {
            throw err;
        }
    });
}
Client.prototype._runInSession = function(f) {
    if (this.req == null) {
        return this.login().then(() => this._runWithRetry(f));
    } else {
        return this._runWithRetry(f);
    }
}
Client.prototype.get = function(url, params) {
    url = adjustUrl(url);
    return this._runInSession(() => this.req.get(url, {params: params || {}}).then(rsp => rsp.data));
}
Client.prototype.post = function(url, data) {
    url = adjustUrl(url);
    return this._runInSession(() => this.req.post(url, data).then(rsp => rsp.data));
}
Client.prototype.login = function() {
    var self = this;
    var con = this.con;
    const baseUrl = con.url.endsWith('/controller') ? con.url : `${con.url}/controller`;
    if (self.loginInflight) {
        return self.loginInflight;
    }
    self.loginInflight = axios.get('/auth?action=login', {
        baseURL: baseUrl,
        auth: {
            username: con.uid.endsWith('@customer1') ? con.uid : `${con.uid}@customer1`,
            password: con.pwd
        }
    }).then(loginResponse => {
        const cookies = loginResponse.headers['set-cookie'].map(cookie.parse);
        const cookieString = cookies.map(c => c.cookieString()).join(';');
        const csrfToken = cookies.find(c => c.key == 'X-CSRF-TOKEN').value;
        self.req = axios.create({
            baseURL: baseUrl,
            headers: {
                'Accept': 'application/json',
                'Content-Type' : 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'Cookie' : cookieString
            }
        });
        self.loginInflight = null;
    });
    return self.loginInflight;
}
Client.prototype.info = function() {
    return this.get('/restui/user/getUser').then(user => ({
      controller: this.con.url,
      account: user
    }));
}

const client = {};
client.open = function(con, cb) {
    const client = new Client(con);
    if (cb) {
        client.login().then(() => cb(client));
    }
    return client;
}

module.exports = client;
