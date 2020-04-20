const express = require('express');
const http = require('http')
const cors = require('cors');
const cookies = require('cookie-parser');

const xor = require('./xor');

const appdServices = require('@metlife/appd-services-js');
const pipeline = require('@metlife/appd-services-js/lib/metrics/pipeline/pipeline');
const appd = require('@metlife/appd-client-js/lib/proxy-client');

const app = express();
app.use(express.static(__dirname +'/../dist/appd-browser-webui'));
app.use(express.json())
app.use(cookies());
app.use(cors());

let appdSession = null;

app.post('/api/login', (req,rsp,next) => {
  const cred = req.body;
  cred.pwd = xor(cred.pwd);
  appd.login(cred.url, cred.uid, cred.pwd, rsp.cookie.bind(rsp))
  .then(session => appd.open(session.session).info())
  .then(info => rsp.json(info))
  .catch(next)
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
  appd.open(req.cookies)
  .info()
  .then(r => rsp.json(r))
  .catch(next);
})

app.post('/api/pipeline/exec', (req,rsp,next) => {
  const expr = req.body;
  const appdSession = appd.open(req.cookies);
  pipeline(appdSession)
    .exec(expr.expr, expr.range)
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

