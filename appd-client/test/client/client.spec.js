const Client = require('../../out/client').Client;
const env = require('../_env');

test('can log in and call service', async() => {
    return Client.open(env.onprem.url, env.onprem.account, env.fid.uid, env.fid.pwd)
    .then(client => {
        client.get("/restui/user/getUser")
        .then(user => {
            expect(user.name).toBe(env.fid.uid);
        })
    });
}, 10 * 1000);

test('can restore serialized', async() => {
    return Client.open(env.onprem.url, env.onprem.account, env.fid.uid, env.fid.pwd)
    .then(client => {
        const session = client.session;
        const ser = session.serialize();
        client = Client.reopen(ser);
        client.get("/restui/user/getUser")
        .then(user => {
            expect(user.name).toBe(env.fid.uid);
        })
    });
}, 10 * 1000);
