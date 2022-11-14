import { round } from "@metlife/appd-libstats";
import { isString } from "@metlife/appd-libutils";
import { MetricTimeseriesGroup } from "../api"
import { reduceGroup, zeros } from "../reduce";

export const percentOf = (tss:MetricTimeseriesGroup, whatRexOrString:string|RegExp=/.*/):MetricTimeseriesGroup => {
   if (tss.length == 0) return tss;

   const what:RegExp = isString(whatRexOrString) ? new RegExp(whatRexOrString as string) : whatRexOrString as RegExp;
   const of = tss.find(ts => what.test(ts.fullName)) || tss[0] // should filter() and filter-expr's be used here instead?
   const whats = tss.filter(ts => ts !== of);
   if (whats.length == 0) {
      whats.push(of);
   }
   return whats.map(what => reduceGroup([what, of], (w, o) => o == 0 ? 0 : round((w/o) * 100, 1), zeros, 'percentOf'));
}
export default percentOf;