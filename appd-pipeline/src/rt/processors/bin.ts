import { Arguments, BaseProcessor } from "./api";
import { MetricTimeseries } from "@metlife/appd-libmetrics";
import { bin } from "@metlife/appd-libmetrics/out/ops/bin";
import { reducersMap } from "@metlife/appd-libmetrics/out/ops/reduce";
import { avg } from "@metlife/appd-libstats";
import parse from 'parse-duration';

export class BinProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        const span = parse(args.span as string, 'minute');
        if (!span) {
            throw new SyntaxError(`invalid span ${span}`);
        }
        const fn = reducersMap[args.fn as string] || avg;
        return bin(series, span, fn);
    }
}