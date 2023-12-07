import e, { NextFunction, Request, Response } from "express";
import { AuthenticationService } from "./services/authentication";
import { Client } from "@metlife/appd-client";

export const APPD_CLIENT = Symbol("APPD_CLIENT");
export function client(req:Request):Client {
   const client = (req as any)[APPD_CLIENT] as Client;
   if (client) {
      return client;
   }
   const error:any = new Error("Unauthorized")
   error.status = 401;
   throw error;
}

export const authenticationMiddleware = async (req:Request, rsp:Response, next:NextFunction) => {
   if (rsp.headersSent) {
      next();
      return;
   }
   try {
      const session = await new AuthenticationService().authenticate(req);
      if (session) {
         (req as any)[APPD_CLIENT] = new Client(session);
         next();
      } else {
         rsp.sendStatus(401);
      }
   } catch (e) {
      rsp
         .status(401)
         .json(e)
   }
}