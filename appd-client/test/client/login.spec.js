const env = require('../_env');
const login = require('../../out/login').default;
test('saml login to SaaS', async () => {
    return login(env.saas.url, env.saas.account, env.fid.uid, env.fid.pwd)
    .then(session => {
        expect(session.sessionId).toBeDefined();
        expect(session.csrf).toBeDefined();
    })
}, 15 * 1000);
test('ldap login to onprem', async () => {
    return login(env.onprem.url, env.onprem.account, env.fid.uid, env.fid.pwd)
    .then(session => {
        expect(session.sessionId).toBeDefined();
        expect(session.csrf).toBeDefined();
    })
}, 15 * 1000);
