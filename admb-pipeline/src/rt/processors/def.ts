import { merge } from "@admb/libutils"
import { CommandExpressionNode, ProcessingNode } from "../../lang/syntax"
import { Context } from "../interpreter"
import { BaseProcessor } from "./api"

export class DefProcessor extends BaseProcessor {
    exec(node: ProcessingNode, ctx: Context): Promise<Context> {
        ctx.variables = merge(ctx.variables, (node as CommandExpressionNode).args);
        return Promise.resolve(ctx);
    }
}
