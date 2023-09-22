import { ReducerFn, clone, isValidNumber } from "@metlife/appd-libutils";
import { MetricDataPoint, MetricDataPointValue, MetricTimeseries } from "../api";
import { GapHandlerFn, zeros } from "../reduce";
import { sum } from "@metlife/appd-libstats";

/**
 * combines continuous metric series values into discrete sets of a given time span
 * @param ts
 * @param spanWidthInMinutes 
 * @param fn
 * @returns 
 */
export const bin = (ts:MetricTimeseries, spanWidthInMinutes:number, fn:ReducerFn<number,number> = sum, gapHandler:GapHandlerFn = zeros):MetricTimeseries => {
   if (ts.data.length == 0) {
      return ts;
   }

   const spanWidthInMillis = spanWidthInMinutes * 60 * 1000;
   const binned:MetricDataPoint[] = [];

   for (let binStart = ts.data[0].start, bin = 0, i = 0, currentBinValues:MetricDataPointValue[] = []; i < ts.data.length; i++) {
      const d = ts.data[i];
      if (d.start > binStart + spanWidthInMillis || i === ts.data.length-1) {
         const filled = currentBinValues
            .map((v, i, a) => isValidNumber(v) ? v : gapHandler(a[i-1], a[i+1], i, a))
            .filter(v => isValidNumber(v))
            .map (v => v as number)
         binned[bin] = {
            start: binStart,
            value: filled.reduce(fn) 
         }

         bin++;
         currentBinValues = [];
         binStart = d.start;
      }
      currentBinValues.push(d.value);
   }
   

   const cts = clone(ts);
   cts.data = binned;
   return cts;
}