import { Client } from "@metlife/appd-client";
import { Request } from "express";

export interface User {
   controller: string;
   account: any;
}

export class UserService {
   static forRequest(req:Request):UserService {
      return new UserService((req as any).client);
   }

   constructor(private client:Client){}

   getUser():Promise<User> {
      return this.client.get('/restui/user/getUser')
      .then((account:any) => ({
          controller: this.client.session.url,
          account
      }));
  }
}