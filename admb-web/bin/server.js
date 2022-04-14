#!/usr/bin/env node
const express = require('express');
const cors = require('cors');
const cookies = require('cookie-parser');

const xor = require('../src/xor');

const appdServices = require('@metlife/appd-services');
const appdClient = require('@metlife/appd-services/lib/client/client');
const appdLogin = require('@metlife/appd-services/lib/client/login');

const createProviders = require('@metlife/appd-services/lib/metrics-pipeline/providers');
const appdProvider = require('@metlife/appd-services/lib/metrics-pipeline/providers/metrics-ex-provider');
const pipeline = require('@metlife/appd-services/lib/metrics-pipeline');

const app = express();
app.use(express.static(__dirname +'/../dist/appd-browser-webui'));
app.use(express.json())
app.use(cookies());
app.use(cors());

app.post('/api/login', (req,rsp,next) => {
  const cred = req.body;
  cred.account = cred.account || 'customer1';
  cred.pwd = xor(cred.pwd);

  appdLogin(cred.url, cred.account, cred.uid, cred.pwd)
  .then(session => {
    serialize(session, rsp.cookie.bind(rsp));
    return getUser(session);
  })
  .then(user => rsp.json(user))
  .catch(next);
});
app.post('/api/logout', (req,rsp,next) => {
  rsp.clearCookie(STORAGE_KEY);
  rsp.json({
    loggedOff: true
  })
});
app.get('/api/user', (req,rsp,next) => {
  getUser(deserialize(req.cookies))
  .then(user => rsp.json(user))
  .catch(next);
})

app.post('/api/pipeline/exec', (req,rsp,next) => {
  const expr = req.body;
  appdClient.open(deserialize(req.cookies))
  .then (con => {
    const providers = createProviders();
    providers.register('appd', appdProvider(con));
    pipeline(providers)
      .exec(expr.expr, expr.range, expr.vars)
      .then(r => rsp.json(r));
  })
  .catch(next);
});
app.get('/api/apps', (req,rsp,next) => {
  appdClient.open(deserialize(req.cookies))
  .then(con => {
    appdServices(con).app.fetchAllApps()
    .then(r => rsp.json(r));
  })
  .catch(next);
});

function getUser(session) {
  return appdClient.open(session)
  .then(con => con.get('/restui/user/getUser'))
  .then(user => {
    return {
      controller: session.baseURL,
      account: user
    };
  });
}

const STORAGE_KEY = "APPDSESSION";
function serialize(session, storage) {
  const b64 = Buffer.from(JSON.stringify(session)).toString('base64');
  storage(STORAGE_KEY, b64);
}
function deserialize(storage) {
  if (storage[STORAGE_KEY]) {
    const b64 = Buffer.from(storage[STORAGE_KEY], 'base64');
    return JSON.parse(b64.toString('ascii'));
  }
  throw new Error("not signed in");
}


const port = 8070;
const server = app.listen(port, () => {
  console.log(`ADMB services listening on port ${port}`);
});
process.on('SIGINT', function() {
  console.log(`Received SIGINT - shutting down ADMB services on port ${port}`);
  server.close();
});
