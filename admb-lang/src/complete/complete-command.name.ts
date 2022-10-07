import { Completion, CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { AdmbCompletionSource } from "./complete";
import { AdmbCompletionProvider } from "./provider";
import { getContextNode, findSibling, text, NO_RESULT, findParent } from "./tree-utils";
import * as processorDefs from '@metlife/appd-pipeline/out/lang/processor-defs';
import { SyntaxNode } from "@lezer/common";

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
      let argCompletions = commandArgs[command];
      if (argCompletions && argCompletions.length > 0) {
         const currentArgs = findParent("CommandExpression", context)?.getChildren("Arg") || [];
         const named = currentArgs.map(arg => arg.getChild("Name")).filter((n):n is SyntaxNode => !!n).map(n => text(n, context));
         argCompletions = argCompletions.filter(c => !named.find(n => n == c.label));
         // TODO eliminate positioned args too, but we can't treat the current Arg as a positioned Arg
         // because we may be currently typing a name that would otherwise be treated as a positioned value
         if (argCompletions.length == 0) return NO_RESULT;

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
