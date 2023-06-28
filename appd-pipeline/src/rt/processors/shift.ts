import { Arguments, BaseProcessor } from "./api";
import { shift } from "@metlife/appd-libmetrics/out/ops/shift";
import { MetricTimeseries } from "@metlife/appd-libmetrics";
import parse from 'parse-duration';

export class ShiftProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        const duration = parse(args.duration as string, 'minute');
        if (!duration) {
            throw new SyntaxError(`invalid duration ${duration}`);
        }
        return shift(series, duration);
    }
}
