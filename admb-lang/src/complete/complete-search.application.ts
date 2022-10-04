import { CompletionContext } from "@codemirror/autocomplete";
import { AdmbCompletionSource } from "./complete";
import { AdmbCompletionProvider } from "./provider";
import { getContextNode, getLeftAdjacent, NO_RESULT } from "./tree-utils";

/**
 * SearchCommandExpression.Application can be completed
 * - for identity
 * - when the contextNode is Command (command's overlap Applications and are only resolved to Application when the : is typed)
 * - when the leftAdjacent node is null
 * - when the leftAdjacent node is Application...although i don't know why this is happening (RESEARCHME)...
 * @param context 
 * @param provider 
 * @returns 
 */
export const SearchApplicationCompletionSource:AdmbCompletionSource = (context:CompletionContext, provider:AdmbCompletionProvider) => {
   const ctx = getContextNode(context);
   if (ctx?.name == "Command" || ctx?.name == "Application") {
      return results(ctx.from, ctx.to, provider);
   } 
   else if (getLeftAdjacent(context) == null) {
      return results(context.pos, context.pos, provider);
   }
   return NO_RESULT;
}

function results(from:number, to:number, provider:AdmbCompletionProvider) {
   return provider.listApps()
   .then(apps => apps.map(label => ({label})))
   .then(options => ({from, to, options}));
}