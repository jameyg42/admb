import { MetricTimeseriesGroup } from "@admb/libmetrics";
import { max, min } from "@admb/libstats";
import { BaseProcessor, Arguments } from "./api";

export class RangeIntersectProcessor extends BaseProcessor {
   execGroup(args:Arguments, group:MetricTimeseriesGroup):MetricTimeseriesGroup|Promise<MetricTimeseriesGroup> {
      const latestStart = group.map(ts => ts.data[0].start).reduce(max);
      const earliestEnd = group.map(ts => ts.data[ts.data.length-1].start).reduce(min);

      return group.map(ts => {
         ts.data = ts.data.filter(d => d.start >= latestStart && d.start <= earliestEnd);
         return ts;
      });
   }
}