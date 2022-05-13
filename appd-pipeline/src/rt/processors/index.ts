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
import { ReduceProcessor } from "./reduce";
import { ScaleProcessor } from "./scale";

export const registry = new ProcessorRegistry();
registry.registerProcessor('search', new SearchProcessor());
registry.registerProcessor('abs', new AbsProcessor());
registry.registerProcessor('binary', new BinaryProcessor());
registry.registerProcessor('bottom', new BottomProcessor());
registry.registerProcessor('reduce', new ReduceProcessor());
registry.registerProcessor('scale', new ScaleProcessor());
