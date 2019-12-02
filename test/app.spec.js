const client = require('./it-client');

const app = require('../lib/app')(client);
app.fetchAllApps().then(console.log);