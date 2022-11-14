import { Completion, CompletionContext } from '@codemirror/autocomplete';
import { AdmbCompletionSource } from './complete';
import { AdmbCompletionProvider } from './provider';
import { getContextNode, getLeftAdjacent, NO_RESULT } from './tree-utils';
import * as processorDefs from '@metlife/appd-pipeline/out/lang/processor-defs';

/**
 * CommandExpression.Command can be completed
 * - for identity
 * - when the leftAdjacent node is null
 * @param context 
 * @param provider 
 * @returns 
 */
export const CommandCompletionSource:AdmbCompletionSource = (context:CompletionContext, provider:AdmbCompletionProvider) => {
   const ctx = getContextNode(context);
   if (ctx?.name == "Command") {
      return results(ctx.from, ctx.to);
   } 
   else if (ctx?.name == "Application") {
      // RESERVED
      // currently, the only way something can be detected as an Application is if the user types
      // characters that aren't allowed in Command names
   }
   else if (getLeftAdjacent(context) == null) {
      return results(context.pos, context.pos);
   }
   return NO_RESULT;
}

function results(from:number, to:number) {
   return Promise.resolve({
      from, to, options: commandOptions
   })
}
const commandOptions:Completion[] = Object.values(processorDefs).map(def => ({
  label: def.name,
  info: def.documentation
}));