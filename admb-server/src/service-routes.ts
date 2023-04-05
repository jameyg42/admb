import { NextFunction, Request, Response, Router, IRouter } from "express";
import { Client, AppServices } from "@admb/services";
import { AppDynamicsMetricsProvider, exec } from "@admb/pipeline";
import { store as storeSession, load as loadSession, end as endSession} from "./session";
import { xor } from "@admb/libutils/out/crypto";
import { AdmbServerConfiguration } from "./config";

import { User } from "./services-api";

export const services = (config:AdmbServerConfiguration):IRouter => {
  const serviceRoutes = Router();

  serviceRoutes.get('/api/controllers', (req, rsp, next) => {
    rsp.json(config.controllers);
    next();
  });

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
      });
      next();
  });
  serviceRoutes.get('/api/user', (req,rsp,next) => {
      const client = loadSession(req);
      getUser(client)
        .then(user => rsp.json(user))
        .catch(next);
  })
  serviceRoutes.post('/api/pipeline/exec', (req,rsp,next) => {
      const {expr, range, vars} = req.body;
      const client = loadSession(req);
      const appdProvider = new AppDynamicsMetricsProvider(client);
      exec(expr, [appdProvider], range, vars)
      .then (results => {
        rsp.json(results);
      })
      .catch(e => {
        rsp.status(500).json(e);
      });
  });
  serviceRoutes.get('/api/pipeline/apps', (req,rsp,next) => {
      const client = loadSession(req);
      const appService = new AppServices(client);
      return appService.fetchAllApps()
        .then(apps => rsp.json(apps))
        .catch(next);
  });
  serviceRoutes.post('/api/pipeline/browse', (req,rsp,next) => {
    const {app, path} = req.body;
    const client = loadSession(req);
    const appdProvider = new AppDynamicsMetricsProvider(client);
    return appdProvider.browseTree(app, path)
      .then(paths => rsp.json(paths))
      .catch(next);
  });
    
  function getUser(client:Client):Promise<User> {
      return client.get('/restui/user/getUser')
      .then((account:any) => ({
          controller: client.session.url,
          account
      }));
  }

  serviceRoutes.use((err:Error, req:Request, rsp:Response, next:NextFunction) => {
    if ((err as any).statusCode == 401) {
      rsp.status(401).send((err as any).statusMessage);
      next();
    } else {
      next(err);
    }
  });

  return serviceRoutes;
}  
