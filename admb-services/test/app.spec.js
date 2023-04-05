const AppServices = require('../out/app').AppServices;
const env = require('dotenv');

const create = () => AppServices.create(env.defaultClient());

test('list all apps', async () => {
    return create().then(async app => {
        const apps = await app.fetchAllApps();
        expect(apps[0].id).toBeDefined();
    });
})
