const express = require('express');
const http = require('http')
const cors = require('cors');

const xor = require('./xor');

const appdServices = require('@metlife/appd-services-js');
const pipeline = require('@metlife/appd-services-js/lib/metrics/pipeline/pipeline');
const appd = require('@metlife/appd-client-js');

const app = express();
app.use(express.static(__dirname +'/../dist/appd-browser-webui'));
app.use(express.json())
app.use(cors());

let appdSession = null;

app.post('/api/login', (req,rsp,next) => {
  const cred = req.body;
  cred.pwd = xor(cred.pwd);
  appdSession = appd.open(cred);
  appdSession.info()
    .then(r => rsp.json(r))
    .catch(next);
})
app.post('/api/logout', (req,rsp,next) => {
  const t = appdSession;
  appdSession = null;
  rsp.json({
    loggedOff: true,
    from: t == null ? null : t.url,
    with: t == null ? null : t.uid
  })
});
app.get('/api/user', (req,rsp,next) => {
  if (!appdSession) {
    rsp.sendStatus(401);
    return;
  }
  appdSession.info()
  .then(r => rsp.json(r))
  .catch(next);
})

app.post('/api/pipeline/exec', (req,rsp,next) => {
  const expr = req.body;
  if (!appdSession) {
    rsp.sendStatus(401);
    return;
  }
  pipeline(appdSession)
    .exec(expr.expr, expr.app, expr.range)
    .then(r => rsp.json(r))
    .catch(next);
});
app.get('/api/apps', (req,rsp,next) => {
  if (!appdSession) {
    rsp.sendStatus(401);
    return;
  }
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

