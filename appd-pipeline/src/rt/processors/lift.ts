import { CommandExpressionNode, ProcessingNode } from "../../lang/syntax";
import { Context } from "../interpreter";
import { BaseProcessor } from "./api";
import { copy } from "./copy";

export class LiftProcessor extends BaseProcessor {
    exec(node: ProcessingNode, ctx: Context): Promise<Context> {
        if (!ctx.parent) {
            return Promise.resolve(ctx);
        }
        const args = (node as CommandExpressionNode).args;
        const deep = args.deep as boolean;
        const preserveGroups = args.preserveGroups as boolean;
        const expr = args.expr as string;

        copy(ctx, expr, deep, preserveGroups, true);

        return Promise.resolve(ctx);
    }
}
