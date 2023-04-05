import { Arguments, BaseProcessor } from "./api";
import { shift } from "@admb/libmetrics/out/ops/shift";
import { MetricTimeseries } from "@admb/libmetrics";
import parse from 'parse-duration';

export class ShiftProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        const duration = parse(args.duration as string, 'minute');
        return shift(series, duration);
    }
}
