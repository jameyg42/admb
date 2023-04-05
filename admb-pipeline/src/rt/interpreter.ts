import { compile } from '../lang/compiler';
import { Range, MetricTimeseries } from '@admb/libmetrics/out/api';

import { of, pipe, OperatorFunction } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { MetricsProvider } from '../metric-providers/spi';
import { PipelineExpressionNode, ProcessingNode } from '../lang/syntax';
import { clone } from 'lodash';

import { findProcessor } from './processors';
import { tmpl } from "@admb/libutils";

// although Search *should* be the only async command, we'll
// continue to use Rx to deal with 'callback hell'.
// This means our "interpreter" run will actually be building
// up the Rx pipeline
// 
// PENDING 
// - behavior of flatten vs. where are timeseries stored

export function exec(expr: string, providers:MetricsProvider[], range:Range, variables:KVP):Promise<MetricTimeseriesGroup[]> {
    expr = tmpl.evaluate(expr, variables);
    const syntaxTree = compile(expr);
    const globalContext = new GlobalContext(providers, range, variables);

    return new Promise((resolve, reject) => {
        of(null) // get the pipe flowing w/ anything other than never
        .pipe(
            assemblePipeline(syntaxTree, globalContext as Context)
        )
        .subscribe({
            complete: () => {
                resolve(globalContext.groups);
            },
            error: (e) => {
                console.error(e);
                reject(e);
            }
        })
    })
}
function assemblePipeline(pipeline:PipelineExpressionNode, ctx:Context):OperatorFunction<null, Context> {
    ctx = new Context(ctx);

    const steps = pipeline.commands.map(cmd => {
        if (cmd instanceof PipelineExpressionNode) {
            return assemblePipeline(cmd as PipelineExpressionNode, ctx);
        }
        const pc = cmd as ProcessingNode;
        return mergeMap(_ => findProcessor(pc.command.name).exec(pc, ctx))
    });
    steps.push(map(() => {
        // once we leave a pipeline, we'll push the groups collected in the sub-context
        // into the parent and discard the context
        if (ctx.parent) { // always true
            ctx.parent.groups = ctx.parent?.groups.concat(ctx.groups)
        }
        return ctx;
    }))

    // Rx pipe() doesn't work properly w/ spread operator, so ugly workaround
    // see https://github.com/ReactiveX/rxjs/issues/3989
    const r = pipe.apply(global, steps as any) as OperatorFunction<null, Context>;
    return r;
}
export type KVP = ({[key:string]:string});
export type MetricTimeseriesGroup = MetricTimeseries[];
export class Context {
    parent?:Context;
    groups:MetricTimeseriesGroup[] = [];
    variables:KVP = {};
    range:Range;

    constructor(parentOrRange?:Context|Range, variables?:KVP) { 
        // ecchh - Context|GlobalContext composition needs to be improved!!!
        // typescript needs overloading!
        this.parent = parentOrRange instanceof Context ? parentOrRange as Context : undefined;
        this.range = this.parent ? clone(this.parent.range) : parentOrRange as Range;
        if (variables) {
            this.variables = variables;
        };
    }

    lookup(name:string):string|undefined {
        const v = this.variables[name];
        if (v) {
            return v;
        }
        if (this.parent) {
            return this.parent.lookup(name);
        }
        return undefined;
    }

    top(): Context {
        let ctx = this as Context;
        while (ctx.parent) {
            ctx = ctx.parent;
        }
        return ctx;
    }
    global(): GlobalContext {
        return this.top() as GlobalContext;
    }
}
export class GlobalContext extends Context {
    constructor(public providers:MetricsProvider[], public globalRange:Range, public globlVariables:KVP) {
        super(globalRange, globlVariables);
    }
}
