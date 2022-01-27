import { Context } from "../../rt/interpreter";
import { CommandNode, SearchExpressionNode } from "../syntax";
import { BaseProcessor, CommandDescription } from "./api";

export class SearchProcessor extends BaseProcessor {
    exec(node: CommandNode, ctx: Context): Promise<Context> {
        const providers = ctx.global().providers;
        return Promise.all(providers.map(provider =>
            provider.fetchMetrics(ctx, node as SearchExpressionNode)
        ))
        .then(metrics => {
            ctx.groups.push(...metrics);
            return ctx;
        })
    }

    description:CommandDescription = {
        name: 'search'
    }
}
