import { Client } from "@metlife/appd-client";
import { MetricTimeseriesGroup, Range } from "@metlife/appd-libmetrics";
import { KVP } from "@metlife/appd-libutils";
import { AppDynamicsMetricsProvider, exec } from "@metlife/appd-pipeline";
import { App, AppServices } from "@metlife/appd-services";
import { Request } from "express";


export class PipelineService {
   static forRequest(req:Request):PipelineService {
      return new PipelineService((req as any).client);
   }

   private metricsProvider:AppDynamicsMetricsProvider;
   private appServices:AppServices;
   constructor(private client:Client){
      this.metricsProvider = new AppDynamicsMetricsProvider(client);
      this.appServices = new AppServices(client);
   }

   getApps():Promise<App[]> {
      return this.appServices.fetchAllApps()
   }
   exec(expr:string, range:Range, vars:KVP):Promise<MetricTimeseriesGroup[]> {
      return exec(expr, [this.metricsProvider], range, vars)
   }
   browse(app:string, path:string[]):Promise<string[]> {
      return this.metricsProvider.browseTree(app, path);
   }
}