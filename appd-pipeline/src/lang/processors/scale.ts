import { Arguments, BaseProcessor, CommandDescription } from "./api";
import { scale } from "@metlife/appd-libmetrics/out/ops/scale";
import { MetricTimeseries } from "@metlife/appd-libmetrics";

export class ScaleProcessor extends BaseProcessor {
    execSeries(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries> {
        return scale(series, args.factor as number);
    }

    description:CommandDescription = {
        name: 'scale',
        shortDescription: 'Scales (multiplies) each value in each series by a specified factor.',
        arguments: [
            {
                name: 'factor',
                type: 'number',
                documentation: 'the numeric factor to scale by'
            }
        ]
    };
}
