import { Client } from "@metlife/appd-client";
import { Request } from "express";
import { client } from "../authentication";

export interface User {
   controller: string;
   account: any;
}

export class UserService {
   constructor(private client:Client){}

   static forRequest(req:Request):UserService {
      return new UserService(client(req));
   }

   getUser():Promise<User> {
      return this.client.get('/restui/user/getUser')
      .then((account:any) => ({
          controller: this.client.session.url,
          account
      }));
  }
}