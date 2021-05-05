const client = require('./it-client');
const appd = require('../index')(client);

appd.app.fetchAllApps().then(console.log);