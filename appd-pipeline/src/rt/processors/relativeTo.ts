import { CommandExpressionNode, ProcessingNode } from "../../lang/syntax";
import { ValueType } from "../../metric-providers/spi";
import { Context } from "../interpreter";
import { BaseProcessor } from "./api";
import { flattenDeep } from "lodash";
import { tmpl } from "@metlife/appd-libutils";

export class RelativeToProcessor extends BaseProcessor {
    exec(node: ProcessingNode, ctx: Context): Promise<Context> {
        // TODO this approach seems very wrong - we should be leveraging the parser here and more of the
        // `search` operator machinery.  Perhaps the easiest way would be to work the `relativeTo` command
        // into the parser itself allowing relativeTo paths to be autocompleted (among other benefits), but
        // i'm not sure we can parse just a path by itself (w/out an application:/ prefix) with the current
        // parser structure.  So for now, just somewhat ugliushly parse out the relative path using regex's.
        const vars = this.flattenVariables(ctx);
        const args = (node as CommandExpressionNode).args;
        const paths = (args.path as string)?.split(';');
        return Promise.all(paths.map(pv => Promise.all(
            flattenDeep(ctx.groups.map(g => 
                g.map(ts => 
                    ts.sources.map(s => {
                        let [,path,value] = /([^\[]*)(?:\[(.*)\]$)?/.exec(pv) || [];
                        path = tmpl.evaluate(path, vars);
                        const values = value === undefined ? [] : value.split(',')
                            .map(vtn => {
                                const [,type,baseline] = /([^@]*)(?:@(.*)$)?/.exec(vtn) || [];
                                return {
                                    type: (type ? tmpl.evaluate(type, vars) : vtn).trim(),
                                    baseline: baseline ? tmpl.evaluate(baseline, vars).trim() : undefined
                                } as ValueType;
                            });
                        
                        const p = resolveRelative(s.path, path || pv);
                        const x = ctx.global().providers.map(provider => {
                            return provider.fetchMetrics(ctx, s.app, p, values);
                        });
                        return x;
                    })
                )
            )))
        ))
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
        } else if (p == '.') {
            // ignore
        } else {
            r.push(p);
        }
    })
    return r;
}
