import { Client } from "@metlife/appd-client";
import { Session } from "@metlife/appd-client/out/client";
import { ReadThroughCache } from "@metlife/appd-libutils/out/cache";
import { xor } from "@metlife/appd-libutils/out/crypto";
import { Request } from "express";

const authenticationCache = new ReadThroughCache({
   maxKeys:20,
   stdTTL: 20 * 60
});


export class AuthenticationError extends Error {
   cause?:Error;
   constructor(msg:string|Error) {
      if (msg instanceof Error) {
         super(msg.message);
         this.cause = msg;
      } else {
         super(msg);
      }
   }
}

export class AuthenticationService {
   /**
    * attempts to authenticate the request using all available auth methods
    * @param req 
    * @returns 
    */
   async authenticate(req:Request):Promise<Session|undefined> {
      if (req.headers.authorization) {
         return this.httpAuthorization(req);
      }
      if (req.headers['x-api-key']) {
         return this.apiKeyAuthorization(req);
      }
      if (req.headers['x-appd-session']) {
         const session = Session.deserialize(req.headers['x-appd-session'] as string);
         return Promise.resolve(session);
      }
      if (req.cookies['APPDSESSION']) {
         const session = Session.deserialize(req.cookies['APPDSESSION']);
         return Promise.resolve(session);
      }

      const {url,account,uid, pwd} = req.body;
      if (url && account && uid && pwd) {
         const session = await this.login(url, account, uid, pwd);
         return session;
      }
      return Promise.resolve(undefined);

   }

   async login(controller:string, account:string, username:string, password:string):Promise<Session> {
      password = xor(password);
      try {
         const client = await Client.open(controller, account, username, password);
         return client.session;
      } catch (e:any) {
         throw new AuthenticationError(e);
      }
   }
   async httpAuthorization(req:Request):Promise<Session> {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
         throw new AuthenticationError("authorization header not present");
      }
      const auth = /^([^ ]+) (.*)$/.exec(authHeader);
      if (!auth) {
         throw new AuthenticationError(`invalid authorization header : ${authHeader}`);
      }
      const [, scheme, encodedParams] = auth;
      if (scheme !== 'Bearer') {
         throw new AuthenticationError(`unsupported authentication scheme : ${scheme}.  Only 'Bearer' is supported`);
      }
      return this._headerAuth(encodedParams);
   }
   async apiKeyAuthorization(req:Request): Promise<Session> {
      const apiKeyHeader = req.headers['x-api-key'];
      if (!apiKeyHeader) {
         throw new AuthenticationError("x-api-key header not present");
      }
      return this._headerAuth(Array.isArray(apiKeyHeader) ? apiKeyHeader.pop() as string: apiKeyHeader as string);
   }
   protected _headerAuth(token:string):Promise<Session> {
      return authenticationCache.get<Session>(token, () => {
         const {controller, account, username, password} = JSON.parse(Buffer.from(token, 'base64').toString());
         return this.login(controller, account, username, password);
      })
   }
}