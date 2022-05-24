import { SyntaxNode } from "@lezer/common";
import { CommandExpressionNode, ProcessingNode, SearchExpressionNode, ValueTypeNode } from "../../lang/syntax";
import { Context } from "../interpreter";
import { BaseProcessor } from "./api";
import { flattenDeep } from "lodash";

export class RelativeToProcessor extends BaseProcessor {
    exec(node: ProcessingNode, ctx: Context): Promise<Context> {
        // TODO we could combine all the paths and do a single search, but for now just
        // fire off a search per series
        const args = (node as CommandExpressionNode).args;
        const path = args.path as string;
        return Promise.all(
            flattenDeep(ctx.groups.map(g => 
                g.map(ts => 
                    ts.sources.map(s => {
                        const p = resolveRelative(s.path, path);
                        const x = ctx.global().providers.map(provider => {
                            const search = new SearchExpressionNode(s.app, p, [], {} as SyntaxNode);
                            return provider.fetchMetrics(ctx, search);
                        });
                        return x;
                    })
                )
            ))
        )
        .then(flattenDeep)
        .then(results => {
            const mode = args.mode as string;
            if (mode == 'replace') {
                ctx.groups = [results];
            } else {
                ctx.groups.push(results);
            }
            return ctx;
        })
    }
}

function resolveRelative(base:string[], path:string) {
    const r = base.slice(0, -1);
    const paths = path.split(/\||\//);
    paths.forEach(p => {
        if (p == '..') {
            r.pop();
        } else {
            r.push(p);
        }
    })
    return r;
}
