import { round } from "@metlife/appd-libstats";
import { MetricTimeseriesGroup } from "../api"
import { reduceGroup, zeros } from "../reduce";

export const percentOf = (tss:MetricTimeseriesGroup):MetricTimeseriesGroup => {
   if (tss.length == 0) return tss;
   const of = tss[0];
   const whats = tss.slice(1);
   if (whats.length == 0) {
      whats.push(of);
   }
   return whats.map(what => reduceGroup([what, of], (w, o) => o == 0 ? 0 : round((w/o) * 100, 1), zeros, 'percentOf'));
}
export default percentOf;