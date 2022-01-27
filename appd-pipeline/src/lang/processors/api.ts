import { MetricTimeseries } from "@metlife/appd-libmetrics";
import { CommandExpressionNode, ProcessingNode } from "../syntax";
import { Context, MetricTimeseriesGroup } from "../../rt/interpreter";

export abstract class BaseProcessor implements CommandProcessor {
    abstract description: CommandDescription;

    exec(node:ProcessingNode, ctx: Context):Promise<Context> {
        const self:any = this as any;
        if (node instanceof CommandExpressionNode) {
            const cmd = node as CommandExpressionNode;
            if (self.execSeries) {
                this.forEachSeries(cmd.args, ctx, (ts) => self.execSeries(cmd.args, ts));
            }
            else if (self.execGroup) {
                this.forEachGroup(cmd.args, ctx, (g) => self.execGroup(cmd.args, g));
            }
        }
        return Promise.resolve(ctx);
    }
    private forEachGroup(args:Arguments, ctx:Context, handler:(g:MetricTimeseriesGroup) => MetricTimeseriesGroup) {
        ctx.groups = ctx.groups.map(g => {
            const results = handler(g);
            results.forEach(ts => this.transformMetadata(ts, args));
            return results;
        });
    }
    private forEachSeries(args:Arguments, ctx:Context, handler:(ts:MetricTimeseries) => MetricTimeseries) {
        ctx.groups = ctx.groups.map(g => 
            g.map(ts => {
                const results = handler(ts);
                this.transformMetadata(results, args);
                return results;
            })    
        )
    }
    transformMetadata(ts:MetricTimeseries, args:Arguments) {
        ts.metadata.processors = ts.metadata.processors || [];
        ts.metadata.processors.push({
            name: this.description.name,
            args
        })
    }
}
export type Arguments = ({[key:string]:string|number|boolean});

export interface CommandProcessor {
    exec(node:ProcessingNode, ctx:Context):Promise<Context>;
    execGroup?(args:Arguments, group:MetricTimeseries[]):MetricTimeseries[]|Promise<MetricTimeseries[]>;
    execSeries?(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries>;

    description: CommandDescription;
}
export interface CommandDescription {
    name:string;
    shortDescription?: string;
    documentation?: string;
    arguments?: CommandArgument[];
}
export interface CommandArgument {
    name:string;
    type:('string'|'number'|'boolean'|undefined);
    documentation?: string;
    optional?: boolean;
}
