import { MetricTimeseries } from "@admb/libmetrics";
import { Context, MetricTimeseriesGroup } from "../../rt/interpreter";
import { CommandDescription } from "../../lang/processor-defs/api";
import { CommandExpressionNode, ProcessingNode, Arguments } from "../../lang/syntax";
import { flatten } from "lodash";
import { isArray, tmpl, merge, isString } from "@admb/libutils";

export { Arguments } from "../../lang/syntax";


export abstract class BaseProcessor implements CommandProcessor {
    exec(node:ProcessingNode, ctx: Context):Promise<Context> {
        const self:any = this as any;
        if (node instanceof CommandExpressionNode) {
            const cmd = node as CommandExpressionNode;
            // resolve variables in arguments - the fact that we need to do this here
            // is design-smell
            cmd.args = this.resolveVariables(ctx, cmd.args);

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
        if (ctx.groups.some(g => g.some(t =>isArray(t)))) {
            ctx.groups = flatten(ctx.groups as any);
        }
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
        ts.metadata = ts.metadata || {};
        ts.metadata.processors = ts.metadata.processors || [];
        ts.metadata.processors.push({
            name: processor.name,
            args
        })
    }
    flattenVariables(ctx:Context) {
        var c = ctx;
        const vars = []
        while (c.parent) {
            vars.push(c.variables);
            c = c.parent;
        }
        return merge(...vars);
    }
    resolveVariables(ctx:Context, args:Arguments):Arguments {
        const vars = this.flattenVariables(ctx);
        const resolved = {} as Arguments;
        for (const k in args) {
            if (isString(args[k])) {
                resolved[k] = tmpl.evaluate(args[k] as string, vars);
            } else {
                resolved[k] = args[k];
            }
        }
        return resolved;
    }
}

export interface CommandProcessor {
    exec(node:ProcessingNode, ctx:Context):Promise<Context>;
    execGroup?(args:Arguments, group:MetricTimeseries[]):MetricTimeseries[]|Promise<MetricTimeseries[]>;
    execSeries?(args:Arguments, series:MetricTimeseries):MetricTimeseries|Promise<MetricTimeseries>;
}
