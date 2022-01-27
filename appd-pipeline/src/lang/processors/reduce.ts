import { MetricTimeseries } from "@metlife/appd-libmetrics";
import { Arguments, BaseProcessor, CommandDescription } from "./api";

export class ReduceProcessor extends BaseProcessor {
    execGroup(args:Arguments, group:MetricTimeseries[]):MetricTimeseries[]|Promise<MetricTimeseries[]> {
        return [];
    }

    description:CommandDescription = {
        name: 'reduce',
        arguments: [
            {
                name: 'fn',
                type: 'string'
            }
        ]
    };
}
