import { CommandProcessor } from "./api";


export class ProcessorRegistry {
    processorMap: ({[key:string]:CommandProcessor}) = {};

    registerProcessor(processor:CommandProcessor) {
        this.processorMap[processor.description.name] = processor;
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
import { ScaleProcessor } from "./scale";
import { ReduceProcessor } from "./reduce";
import { AbsProcessor } from "./abs";
import { BinaryProcessor } from "./binary";

export const registry = new ProcessorRegistry();
registry.registerProcessor(new SearchProcessor());
registry.registerProcessor(new ScaleProcessor());
registry.registerProcessor(new ReduceProcessor());
registry.registerProcessor(new AbsProcessor());
registry.registerProcessor(new BinaryProcessor());
