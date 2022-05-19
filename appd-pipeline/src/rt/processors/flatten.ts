import { ProcessingNode } from "../../lang/syntax";
import { Context } from "../interpreter";
import { BaseProcessor } from "./api";
import { flatten } from "lodash";

export class FlattenProcessor extends BaseProcessor {
    exec(node: ProcessingNode, ctx: Context): Promise<Context> {
        ctx.groups = [flatten(ctx.groups)];
        return Promise.resolve(ctx);
    }
}
