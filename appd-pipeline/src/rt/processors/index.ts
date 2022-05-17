import { CommandProcessor } from "./api";

export class ProcessorRegistry {
    processorMap: ({[key:string]:CommandProcessor}) = {};

    registerProcessor(name:string, processor:CommandProcessor) {
        this.processorMap[name] = processor;
    }

    getProcessor(name:string):CommandProcessor {
        return this.processorMap[name];
    }
}
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
export const registry = new ProcessorRegistry();
registry.registerProcessor('search', new SearchProcessor());
registry.registerProcessor('abs', new AbsProcessor());
registry.registerProcessor('binary', new BinaryProcessor());
registry.registerProcessor('bottom', new BottomProcessor());
registry.registerProcessor('ceil', new CeilProcessor());
registry.registerProcessor('derivative', new DerivativeProcessor());
registry.registerProcessor('e', new EProcessor());
registry.registerProcessor('floor', new FloorProcessor());
registry.registerProcessor('integral', new IntegralProcessor());
registry.registerProcessor('limit', new LimitProcessor());
registry.registerProcessor('reduce', new ReduceProcessor());
registry.registerProcessor('scale', new ScaleProcessor());
registry.registerProcessor('top', new TopProcessor());
registry.registerProcessor('log', new LogProcessor());
registry.registerProcessor('normalize', new NormalizeProcessor());
registry.registerProcessor('offset', new OffsetProcessor());
registry.registerProcessor('outlier', new OutlierProcessor());
registry.registerProcessor('percentOf', new PercentOfProcessor());
registry.registerProcessor('shift', new ShiftProcessor());
registry.registerProcessor('smooth', new SmoothProcessor());
registry.registerProcessor('sort', new SortProcessor());
