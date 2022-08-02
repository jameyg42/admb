import { CommandNode, SearchExpressionNode, ValueTypeNode } from "../../lang/syntax";
import { Context } from "../../rt/interpreter";
import { BaseProcessor } from "./api";
import { clone, tmpl } from "@metlife/appd-libutils";

export class SearchProcessor extends BaseProcessor {
    exec(node: CommandNode, ctx: Context): Promise<Context> {
        const vars = this.flattenVariables(ctx);
        const resolved = clone(node) as SearchExpressionNode;
        resolved.app = tmpl.evaluate(resolved.app, vars);
        resolved.path = resolved.path.map(p => tmpl.evaluate(p, vars));
        resolved.values = resolved.values.map(v => ({
            type: v.type ? tmpl.evaluate(v.type, vars) : v.type,
            baseline: v.baseline ? tmpl.evaluate(v.baseline, vars) : v.baseline
        } as ValueTypeNode));
        const providers = ctx.global().providers;
        return Promise.all(providers.map(provider =>
            provider.fetchMetrics(ctx, resolved)
        ))
        .then(metrics => {
            ctx.groups.push(...metrics);
            return ctx;
        })
    }
}
