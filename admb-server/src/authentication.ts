import e, { NextFunction, Request, Response } from "express";
import { AuthenticationService } from "./services/authentication";
import { Client } from "@metlife/appd-client";

export const authenticationMiddleware = async (req:Request, rsp:Response, next:NextFunction) => {
   if (rsp.headersSent) {
      next();
      return;
   }
   try {
      const session = await new AuthenticationService().authenticate(req);
      if (session) {
         (req as any).client = new Client(session);
      } else {
         rsp.sendStatus(401);
      }
      next();
   } catch (e) {
      rsp
         .status(401)
         .json(e)
   }
}