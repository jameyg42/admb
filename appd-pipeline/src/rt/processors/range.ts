import { CommandExpressionNode, ProcessingNode } from "../../lang/syntax"
import { Context } from "../interpreter"
import { BaseProcessor } from "./api"
import parse from "parse-duration";

export class RangeProcessor extends BaseProcessor {
    exec(node: ProcessingNode, ctx: Context): Promise<Context> {
        const args = (node as CommandExpressionNode).args;

        const shift = args.shift as string;
        if (shift == "reset") {
            ctx.range = ctx.global().globalRange;
        } else {
            const duration = parse(args.shift as string, 'millisecond');
            ctx.range.endTime += duration;
            ctx.range.startTime += duration;
        }

        return Promise.resolve(ctx);
    }
}
