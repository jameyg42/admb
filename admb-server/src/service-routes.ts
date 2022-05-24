import { Router } from "express";
import { Client, AppServices } from "@metlife/appd-services";
import { AppDynamicsMetricsProvider, exec } from "@metlife/appd-pipeline";
import { store as storeSession, load as loadSession, end as endSession} from "./session";
import { xor } from "@metlife/appd-libutils/out/crypto";

export const serviceRoutes = Router();

serviceRoutes.post('/api/login', (req,rsp,next) => {
    const cred = req.body;
    cred.account = cred.account || 'customer1';
    cred.pwd = xor(cred.pwd);
  
    Client.open(cred.url, cred.account, cred.uid, cred.pwd)
    .then(client => {
      storeSession(client, rsp);
      return getUser(client);
    })
    .then(user => rsp.json(user))
    .catch(next);
});
serviceRoutes.post('/api/logout', (req,rsp,next) => {
    endSession(rsp);
    rsp.json({
      loggedOff: true
    })
});

serviceRoutes.get('/api/user', (req,rsp,next) => {
    const client = loadSession(req);
    getUser(client)
      .then(user => rsp.json(user))
      .catch(next);
})
  
serviceRoutes.post('/api/pipeline/exec', (req,rsp,next) => {
    const expr = req.body;
    const client = loadSession(req);
    const appdProvider = new AppDynamicsMetricsProvider(client);
    exec(expr.expr, [appdProvider], expr.range, expr.vars)
    .then (results => {
      rsp.json(results);
    })
    .catch(e => {
      rsp.status(500).json(e);
    });
});
serviceRoutes.get('/api/apps', (req,rsp,next) => {
    const client = loadSession(req);
    const appSvc = new AppServices(client);
    return appSvc.fetchAllApps()
      .then(apps => rsp.json(apps))
      .catch(next);
});
  
function getUser(client:Client):Promise<User> {
    return client.get('/restui/user/getUser')
    .then((account:any) => ({
        controller: client.session.url,
        account
    }));
}
  
export interface User {
    controller: string;
    account: any;
}
