import { App, Baseline } from "../app";
import { Range } from "../range";
export type AppArg = App | number;
export type BaselineArg = Baseline | number;

export type Path = string[];
export type PathArg = Path | string;
export interface MetricNode {
    // useful props
    name: string;
    hasChildren:boolean;
    metricId: number;
    entityId: number;

    // props added by metrics service
    path: Path;
    app: App|number;

    // mostly useless props
    type: string|null;
    children: MetricNode[] | null;
    metricPath: string|null;
    iconPath:string|null;
    metricTreeRootType: string|null // OVERALL_APP_PERF; BT_PERF; etc - only on root nodes
}

export interface Metric {
   metricId: number;
   metricName: string;
   frequency: string;
   granularityMinutes: number;
   data: MetricData[];

   // enhancements
   node: MetricNode;
   range: Range;
   baseline?: Baseline
}
export interface MetricData {
    startTime: number;
    value?: MetricValue;
    min?: MetricValue;
    max?: MetricValue;
    current?: MetricValue;
    sum?: MetricValue;
    count?: MetricValue;
    useRange?: boolean;
    groupCount?: MetricValue;
    occurances?: MetricValue;
    baseline?: MetricValue;
    stddev?: MetricValue;
}
export type MetricValue = number|null;
