#!/usr/bin/env node
const express = require('express');
const http = require('http')
const cors = require('cors');
const cookies = require('cookie-parser');

const xor = require('../src/xor');

const appdServices = require('@metlife/appd-services');
const appd = require('@metlife/appd-services/lib/client/proxy-client');

const createProviders = require('@metlife/appd-services/lib/metrics-pipeline/providers');
const appdProvider = require('@metlife/appd-services/lib/metrics-pipeline/providers/metrics-ex-provider');
const prometheusProvider = require('@metlife/appd-services/lib/metrics-pipeline/providers/prometheus-provider');
const pipeline = require('@metlife/appd-services/lib/metrics-pipeline');


const app = express();
app.use(express.static(__dirname +'/../dist/appd-browser-webui'));
app.use(express.json())
app.use(cookies());
app.use(cors());

app.post('/api/login', (req,rsp,next) => {
  const cred = req.body;
  cred.pwd = xor(cred.pwd);
  appd.login(cred.url, cred.uid, cred.pwd, rsp.cookie.bind(rsp))
  .then(session => appd.open(session.session).info())
  .then(info => rsp.json(info))
  .catch(next)
})
app.post('/api/logout', (req,rsp,next) => {
  // FIXME shouldn't know the cookie name here
  rsp.clearCookie('APPDSESSION');
  rsp.json({
    loggedOff: true
  })
});
app.get('/api/user', (req,rsp,next) => {
  appd.open(req.cookies)
  .info()
  .then(r => rsp.json(r))
  .catch(next);
})

app.post('/api/pipeline/exec', (req,rsp,next) => {
  const expr = req.body;
  const appdSession = appd.open(req.cookies);
  const providers = createProviders();
  providers.register('appd', appdProvider(appdSession))
  providers.register('prometheus-risc', prometheusProvider('@prometheus-risc', 'http://risc.prometheus.metlife.com'));
  pipeline(providers)
    .exec(expr.expr, expr.range, expr.vars)
    .then(r => rsp.json(r))
    .catch(next);
});
app.get('/api/apps', (req,rsp,next) => {
  const appdSession = appd.open(req.cookies);
  appdServices(appdSession).app.fetchAllApps()
  .then(r => rsp.json(r))
  .catch(next);
});


const server = http.createServer(app);
server.listen(8070, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});


process.on('SIGINT', function() {
  process.exit();
});
