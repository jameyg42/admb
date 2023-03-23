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
  const nsi = Error('401 : Not signed in') as any;
  nsi.statusCode = 401;
  nsi.statusMessage = "Not signed in";
  throw nsi;
}
export function end(rsp:Response) {
    rsp.clearCookie(STORAGE_KEY);
}
