import { Router } from "express";
import { PipelineService } from "../services/pipeline";

export const serviceRoutes = Router();
serviceRoutes.post('/pipeline/exec', async (req,rsp,next) => {
   const {expr, range, vars} = req.body;
   try {
      const results = await PipelineService.forRequest(req).exec(expr, range, vars);
      rsp.json(results);
      next();
   } catch (e) {
      next(e)
   }
});
serviceRoutes.get('/pipeline/apps', async (req,rsp,next) => {
   try {
      const results = await PipelineService.forRequest(req).getApps();
      rsp.json(results);
      next();
   } catch (e) {
      next(e)
   }
});
serviceRoutes.post('/pipeline/browse', async (req,rsp,next) => {
   const {app, path} = req.body;
   try {
      const results = await PipelineService.forRequest(req).browse(app, path);
      rsp.json(results);
      next();
   } catch (e) {
      next(e)
   }
});