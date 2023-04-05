
import { Client } from "../client";

export class ViolationsServices {
   constructor(private client:Client) {  }

   static create(client:Client|Promise<Client>):Promise<ViolationsServices> {
      return client instanceof Client
          ? Promise.resolve(new ViolationsServices(client))
          : client.then(c => new ViolationsServices(c));
   }

   
}