import { MetricTimeseriesGroup } from "@metlife/appd-libmetrics";
import { Arguments } from "../../lang/syntax";
import { BaseProcessor } from "./api";
import { correlateGroup } from '@metlife/appd-libmetrics/out/ops/correlate';
import { pearson, spearman } from '@metlife/appd-libstats';

export class CorrProcessor extends BaseProcessor {
    execGroup(args:Arguments, series:MetricTimeseriesGroup):MetricTimeseriesGroup|Promise<MetricTimeseriesGroup> {
        return correlateGroup(series, cfn[args.fn as string], args.window as number);
    }
}

const cfn = {
    'pearson' : pearson,
    'spearman' : spearman
} as any;
