import { MetricTimeseries } from "@metlife/appd-libmetrics";
import { Context, MetricTimeseriesGroup } from "../../rt/interpreter";
import { CommandDescription } from "../../lang/processor-defs/api";
import { CommandExpressionNode, ProcessingNode } from "../../lang/syntax";

export abstract class BaseProcessor implements CommandProcessor {
    exec(node:ProcessingNode, ctx: Context):Promise<Context> {
        const self:any = this as any;
        if (node instanceof CommandExpressionNode) {
            const cmd = node as CommandExpressionNode;
            if (self.execSeries) {
                this.forEachSeries(cmd.args, ctx, (ts) => self.execSeries(cmd.args, ts), node);
            }
            else if (self.execGroup) {
                this.forEachGroup(cmd.args, ctx, (g) => self.execGroup(cmd.args, g), node);
            }
        }
        return Promise.resolve(ctx);
    }
    private forEachGroup(args:Arguments, ctx:Context, handler:(g:MetricTimeseriesGroup) => MetricTimeseriesGroup, node:ProcessingNode) {
        ctx.groups = ctx.groups.map(g => {
            const results = handler(g);
            results.forEach(ts => this.transformMetadata(ts, node.command, args));
            return results;
        });
    }
    private forEachSeries(args:Arguments, ctx:Context, handler:(ts:MetricTimeseries) => MetricTimeseries, node:ProcessingNode) {
        ctx.groups = ctx.groups.map(g => 
            g.map(ts => {
                const results = handler(ts);
                this.transformMetadata(results, node.command, args);
                return results;
            })    
        )
    }
    transformMetadata(ts:MetricTimeseries, processor:CommandDescription, args:Arguments) {
        ts.metadata.processors = ts.metadata.processors || [];
        ts.metadata.processors.push({
            name: processor.name,
            args
        })
    }
}
export type Arguments = ({[key:string]:string|number|boolean});

export interface CommandProcessor {
    exec(node:ProcessingNode, ctx:Context):Promise<Context>;
    execGroup?(args:Arguments, group:MetricTimeseries[]):MetricTimeseries[]|Promise<MetricTimeseries[]>;
    execSeries?(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries>;
}
