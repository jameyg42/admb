#!/usr/bin/env node
const express = require('express');
const cors = require('cors');
const cookies = require('cookie-parser');

const xor = require('../src/xor');

const appd = require('@metlife/appd-services');
const pipeline = require('@metlife/appd-pipeline');

const app = express();
app.use(express.static(__dirname +'/../dist/appd-browser-webui'));
app.use(express.json())
app.use(cookies());
app.use(cors());


app.post('/api/login', (req,rsp,next) => {
  const cred = req.body;
  cred.account = cred.account || 'customer1';
  cred.pwd = xor(cred.pwd);

  appd.Client.open(cred.url, cred.account, cred.uid, cred.pwd)
  .then(client => {
    persistSession(client.session.serialize(), rsp.cookie.bind(rsp));
    return getUser(client);
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
  const client = appd.Client.reopen(retrieveSession(req.cookies));
  getUser(client)
  .then(user => rsp.json(user))
  .catch(next);
})

app.post('/api/pipeline/exec', (req,rsp,next) => {
  const expr = req.body;
  const client = appd.Client.reopen(retrieveSession(req.cookies));
  const appdProvider = new pipeline.AppDynamicsMetricsProvider(client);
  pipeline.exec(expr.expr, [appdProvider], expr.range, expr.vars)
  .then (results => {
    rsp.json(results);
  })
  .catch(e => {
    rsp.status(500).json(e);
  });
});
app.get('/api/apps', (req,rsp,next) => {
  const client = appd.Client.reopen(retrieveSession(req.cookies));
  const appSvc = new appd.AppServices(client);
  return appSvc.fetchAllApps().then(apps => rsp.json(apps)).catch(next);
});

function getUser(client) {
  return client.get('/restui/user/getUser')
  .then(user => {
    return {
      controller: client.session.url,
      account: user
    };
  });
}

const STORAGE_KEY = "APPDSESSION";
function persistSession(session, storage) {
  storage(STORAGE_KEY, session);
}
function retrieveSession(storage) {
  if (storage[STORAGE_KEY]) {
    return storage[STORAGE_KEY];
  }
  throw {status:401, message: 'Not signed in'};
}


app.use((err, req, rsp, next) => {
  if (err.message) {
    rsp.status(err.status || 500)
      .send(err.message);
  } else {
    rsp.sendStatus(err.status || 500);
  }
  console.error(`[${new Date().toISOString()}] ${req.originalUrl} ${rsp.statusCode} - ${err.message}`);
  next();
});


const port = 8070;
const server = app.listen(port, () => {
  console.log(`ADMB services listening on port ${port}`);
});
process.on('SIGINT', function() {
  console.log(`Received SIGINT - shutting down ADMB services on port ${port}`);
  server.close();
});
