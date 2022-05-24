import { Client } from "@metlife/appd-services";
import { Request, Response } from "express";

const STORAGE_KEY = "APPDSESSION";
export function store(client:Client, rsp:Response) {
    rsp.cookie(STORAGE_KEY, client.session.serialize());
}
export function load(req:Request) {
  if (req.cookies[STORAGE_KEY]) {
    return Client.reopen(req.cookies[STORAGE_KEY]);
  }
  throw {status:401, message: 'Not signed in'};
}
export function end(rsp:Response) {
    rsp.clearCookie(STORAGE_KEY);
}
