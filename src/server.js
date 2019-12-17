const express = require('express');
const http = require('http')
const cors = require('cors');
const appdServices = require('@metlife/appd-services-js');
const pipeline = require('@metlife/appd-services-js/lib/metrics/pipeline/pipeline');
const appd = require('@metlife/appd-client-js');

const app = express();
app.use(express.static(__dirname +'/../dist/appd-browser-webui'));
app.use(express.json())
app.use(cors());

// TODO move this to user session
const appdSession = appd.open({
  url: 'https://appd.metlife.com',
  uid : 'AQ813306',
  pwd : 'gad8babU'
});

app.post('/api/pipeline/exec', (req,rsp) => {
  const expr = req.body;
  pipeline(appdSession)
    .exec(expr.expr, expr.app, expr.range)
    .then(function(r) {
      rsp.json(r);
    }).catch(function(e) {
      rsp.status = 500;
      rsp.json(e);
    });
});
app.get('/api/apps', (req,rsp) => {
  appdServices(appdSession).app.fetchAllApps()
  .then(function(r) {
    rsp.json(r);
  })
})


const server = http.createServer(app);
server.listen(8070, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});
