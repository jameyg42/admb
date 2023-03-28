import { CommandExpressionNode, ProcessingNode } from "../../lang/syntax"
import { Context } from "../interpreter"
import { BaseProcessor } from "./api"
import parse from "parse-duration";
import { Range } from "@metlife/appd-libmetrics/out/range";

export class RangeProcessor extends BaseProcessor {
    exec(node: ProcessingNode, ctx: Context): Promise<Context> {
        const args = (node as CommandExpressionNode).args;

        const shift = args.shift as string;
        if (shift == "reset") {
            ctx.range = ctx.global().globalRange;
        } else {
            const duration = parse(args.shift as string, 'millisecond');
            // don't assume the Range here is a concrete metrics.range.Range class since it likely
            // came "over the wire" as it's metrics.api.Range form.  Eventually libmetrics will
            // make this less confusing, but for now construct a range.Range so we can do the manipulation
            const range = Range.fromRangeLike(ctx.range);
            ctx.range = range.slide({'milliseconds': duration}).toRangeLikeObject();
        }

        return Promise.resolve(ctx);
    }
}
