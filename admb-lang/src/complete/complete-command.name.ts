import { Completion, CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { AdmbCompletionSource } from "./complete";
import { AdmbCompletionProvider } from "./provider";
import { getContextNode, findSibling, text, NO_RESULT } from "./tree-utils";
import * as processorDefs from '@metlife/appd-pipeline/out/lang/processor-defs';

/**
 * CommandExpression.Arg.Name's can be completed
 * - for identity
 * - when the whitespace-adjacent node is Command
 * - when the context node is CommandExpression
 * - when the context node is CommandExpression.Arg.Value AND that Arg doesn't already have a Name
 * @param context 
 * @param provider 
 * @returns 
 */
export const CommandNameCompletionSource:AdmbCompletionSource = (context:CompletionContext, provider:AdmbCompletionProvider) => {
   const commandNode = findSibling("CommandExpression", "Command", context);
   if (commandNode) {
      const command = text(commandNode, context);
      const argCompletions = commandArgs[command];
      if (argCompletions && argCompletions.length > 0) {
         const ctx = getContextNode(context);

         if (ctx == null) {
            return results(context.pos, context.pos, argCompletions);
         }
         else if (ctx.name == "Name") {
            return results(ctx.from, ctx.to, argCompletions);
         } 
         else if (ctx.name == "Value") {
            const name = findSibling("Arg", "Name", context);
            if (name == null) {
               return results(ctx.from, ctx.to, argCompletions);
            }
         }
      }
   }
   return NO_RESULT;
}

function results(from:number, to:number, options:Completion[]):Promise<CompletionResult> {
   return Promise.resolve({
      from, to, options
   });
}

const commandArgs:({[key:string]:Completion[]}) = {};
Object.values(processorDefs).forEach(def => {
  commandArgs[def.name] = def.arguments?.map(arg => ({
    label: arg.name,
    info: arg.documentation
  })) || []
});
