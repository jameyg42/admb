import { MetricTimeseriesGroup } from "@metlife/appd-libmetrics";
import { CommandExpressionNode, ProcessingNode } from "../../lang/syntax";
import { Context } from "../interpreter";
import { BaseProcessor } from "./api";
import { flatten } from "lodash";
import { filter } from "@metlife/appd-libmetrics/out/ops/filter";
import { clone } from "@metlife/appd-libutils";

export class CopyProcessor extends BaseProcessor {
    exec(node: ProcessingNode, ctx: Context): Promise<Context> {
        if (!ctx.parent) {
            return Promise.resolve(ctx);
        }
        const args = (node as CommandExpressionNode).args;
        const deep = args.deep as boolean;
        const preserveGroups = args.preserveGroups as boolean;
        const expr = args.expr as string;

        copy(ctx, expr, deep, preserveGroups, false);

        return Promise.resolve(ctx);
    }
}

export function copy(ctx:Context, expr:string, deep:boolean, preserveGroups:boolean, deleteSource:boolean) {
    let c = ctx;
    let allMatched:MetricTimeseriesGroup = [];
    if (!c.parent) return; // shut typescript up for impossible condition
    do {
        c = c.parent;
        c.groups = c.groups.map(group => {
            const matched = (expr ? group.filter(s => filter(s, expr)) : group)
                .map(ts => deleteSource ? ts : clone(ts));
            allMatched = allMatched.concat(matched);
            if (deleteSource) {
                if (expr) {
                    return group.filter(s => !filter(s, expr))
                } else {
                    return [];
                }
            } else {
                return group;
            }
        })
    } while (c.parent && deep);

    ctx.groups = ctx.groups.concat(preserveGroups ? allMatched : [flatten(allMatched)]);
}
