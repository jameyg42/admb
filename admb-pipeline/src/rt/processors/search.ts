import { CommandNode, SearchExpressionNode } from "../../lang/syntax";
import { Context } from "../../rt/interpreter";
import { BaseProcessor } from "./api";
import { tmpl } from "@admb/libutils";
import { ValueType } from "../../metric-providers/spi";

export class SearchProcessor extends BaseProcessor {
    exec(node: CommandNode, ctx: Context): Promise<Context> {
        const vars = this.flattenVariables(ctx);
        const search = node as SearchExpressionNode;
        const app = tmpl.evaluate(search.app, vars);
        const path = search.path.map(p => tmpl.evaluate(p, vars));
        const values = search.values.map(v => ({
            type: v.type ? tmpl.evaluate(v.type, vars) : v.type,
            baseline: v.baseline ? tmpl.evaluate(v.baseline, vars) : v.baseline
        } as ValueType));
        const providers = ctx.global().providers;
        return Promise.all(providers.map(provider => 
            provider.fetchMetrics(ctx, app, path, values)
        ))
        .then(metrics => {
            ctx.groups.push(...metrics);
            return ctx;
        })
    }
}
