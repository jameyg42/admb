import { Arguments, BaseProcessor, CommandDescription } from "./api";
import { abs } from "@metlife/appd-libmetrics/out/ops/abs";
import { MetricTimeseries } from "@metlife/appd-libmetrics";

export class AbsProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return abs(series);
    }

    description:CommandDescription = {
        name: 'abs',
        shortDescription: 'Sets the absolute value for each value in the series.',
        documentation: 'Useful when combined with `derivative` to show the change regardless',
        arguments: []
    };
}
