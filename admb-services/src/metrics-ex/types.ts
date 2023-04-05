import { App, Baseline } from "../app";
import { PathArg } from "../metrics";
import { MetricData, MetricNode, Path } from "../metrics/types";
import { Range } from "../range";

export type PathExArg = PathArg | (string|RegExp)[];
export type PathEx = (string|RegExp)[];

// 
export interface MetricEx {
    name: string;
    fullName: string;
    node: MetricNode;
    range: Range;
    precision: number;

    data: MetricData[];
    baselineData: BaselineData[];
}
export interface BaselineData {
    baseline: Baseline;
    data: MetricData[];
}
