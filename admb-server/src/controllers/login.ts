import { Client } from "@metlife/appd-client";
import { Router } from "express";
import { AuthenticationService } from "../services/authentication";
import { UserService } from "../services/user";

export const serviceRoutes = Router();

serviceRoutes.post('/login', async (req,rsp,next) => {
   try {
      const {url, account, uid, pwd } = req.body;
      const session = await new AuthenticationService().login(url, account, uid, pwd);
      if (session) {
         rsp.cookie('APPDSESSION', session.serialize());
         const user = await new UserService(new Client(session)).getUser();
         rsp.json(user);
      } else {
         rsp.status(401).send('no available authentication methods for request');
      }
   } catch(e) {
      next(e);
   }
});
serviceRoutes.post('/logout', (req,rsp,next) => {
    rsp.clearCookie('APPDSESSION');
    rsp.json({
      loggedOff: true
    });
});