import { Router } from "express";
import { UserService } from "../services/user";

export const serviceRoutes = Router();
serviceRoutes.get('/user', async (req,rsp,next) => {
   try {
      const results = await UserService.forRequest(req).getUser();
      rsp.json(results);
      next();
   } catch (e) {
      next(e)
   }
});