import { CommandProcessor } from "./api";

export class ProcessorRegistry {
    processorMap: ({[key:string]:CommandProcessor}) = {};

    add(name:string, processor:CommandProcessor) {
        this.processorMap[name] = processor;
    }

    getProcessor(name:string):CommandProcessor {
        return this.processorMap[name];
    }
}
export const registry = new ProcessorRegistry();
export function findProcessor(name:string) {
    return registry.getProcessor(name);
}

// REMINDER that processors should delegate much of their work to an "op" in the appd-libmetrics/ops package
import { SearchProcessor } from "./search";
import { AbsProcessor } from "./abs";
import { BinaryProcessor } from "./binary";
import { BottomProcessor } from "./bottom";
import { CeilProcessor } from "./ceil";
import { DerivativeProcessor } from "./derivative";
import { EProcessor } from "./e";
import { FloorProcessor } from "./floor";
import { ReduceProcessor } from "./reduce";
import { ScaleProcessor } from "./scale";
import { TopProcessor } from "./top";
import { IntegralProcessor } from "./integral";
import { LogProcessor } from "./log";
import { LimitProcessor } from "./limit";
import { NormalizeProcessor } from "./normalize";
import { OffsetProcessor } from "./offset";
import { OutlierProcessor } from "./outlier";
import { PercentOfProcessor } from "./percentOf";
import { ShiftProcessor } from "./shift";
import { SmoothProcessor } from "./smooth";
import { SortProcessor } from "./sort";
import { ToZeroProcessor } from "./toZero";
import { FilterProcessor } from "./filter";
import { FilterGroupProcessor } from "./filterGroup";
import { FlattenProcessor } from "./flatten";
import { GroupByProcessor } from "./groupBy";
import { LabelProcessor } from "./label";
import { CopyProcessor } from "./copy";
import { LiftProcessor } from "./lift";
import { DefProcessor } from "./def";
import { RangeProcessor } from "./range";
import { RelativeToProcessor } from "./relativeTo";
import { PlotProcessor } from "./plot";
import { SqrtProcessor } from "./sqrt";
import { CorrProcessor } from "./corr";
import { ThresholdProcessor } from "./threshold";

registry.add('search', new SearchProcessor());
registry.add('abs', new AbsProcessor());
registry.add('binary', new BinaryProcessor());
registry.add('bottom', new BottomProcessor());
registry.add('ceil', new CeilProcessor());
registry.add('derivative', new DerivativeProcessor());
registry.add('e', new EProcessor());
registry.add('floor', new FloorProcessor());
registry.add('integral', new IntegralProcessor());
registry.add('limit', new LimitProcessor());
registry.add('reduce', new ReduceProcessor());
registry.add('scale', new ScaleProcessor());
registry.add('top', new TopProcessor());
registry.add('log', new LogProcessor());
registry.add('normalize', new NormalizeProcessor());
registry.add('offset', new OffsetProcessor());
registry.add('outlier', new OutlierProcessor());
registry.add('percentOf', new PercentOfProcessor());
registry.add('shift', new ShiftProcessor());
registry.add('smooth', new SmoothProcessor());
registry.add('sort', new SortProcessor());
registry.add('toZero', new ToZeroProcessor());
registry.add('filter', new FilterProcessor());
registry.add('filterGroup', new FilterGroupProcessor());
registry.add('flatten', new FlattenProcessor());
registry.add('groupBy', new GroupByProcessor());
registry.add('label', new LabelProcessor());
registry.add('copy', new CopyProcessor());
registry.add('lift', new LiftProcessor());
registry.add('def', new DefProcessor());
registry.add('range', new RangeProcessor());
registry.add('relativeTo', new RelativeToProcessor());
registry.add('plot', new PlotProcessor());
registry.add('sqrt', new SqrtProcessor());
registry.add('corr', new CorrProcessor());
registry.add('threshold', new ThresholdProcessor());