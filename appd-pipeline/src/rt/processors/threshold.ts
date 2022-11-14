import { Arguments, BaseProcessor } from "./api";
import { MetricTimeseries, PrecisionUnit } from "@metlife/appd-libmetrics";
import { min, max } from "@metlife/appd-libstats";

/**
 * FIXME currently Threshold creates an actual series that is impacted by future pipeline operations,
 * like reduce.  Thresholds should be pure metadata (similar to plot).
 */
export class ThresholdProcessor extends BaseProcessor {
   execGroup(args:Arguments, group:MetricTimeseries[]):MetricTimeseries[]|Promise<MetricTimeseries[]> {
      const value = args['value'] as number;

      const earliest = min(group.map(ts => ts.data[0]).filter(dp => dp).map(dp => dp.start));
      const latest = max(group.map(ts => ts.data[ts.data.length-1]).filter(dp => dp).map(dp => dp.start));

      group.push({
         name: 'threshold',
         fullName: 'threshold',
         source: {app: 'n/a', path: ['/'] },
         sources: [{app: 'n/a', path: ['/'] }],
         range: {
            type: 'BETWEEN_TIMES',
            startTime: earliest,
            endTime: latest
         },
         value: 'value',
         precision: {size:1, units: PrecisionUnit.Minutes},
         metadata: {},
         data: [
            {start: earliest, value},
            {start: latest, value}
         ]
      });
      return group;
  }
}
