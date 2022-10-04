import { CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { AdmbCompletionSource } from "./complete";
import { AdmbCompletionProvider } from "./provider";
import { findParent, getContextNode, getLeftAdjacent, nodeEquals, NO_RESULT, text } from "./tree-utils";

/**
 * SearchCommandExpression.Path.PathSegments can be completed
 * - when identity
 * - when the leftAdjacent is a PathSegment (we're actually still logicall in the
 *   PathSegment at this point, but whitespace as delimiter has precedence in the 
 *   parser causing trailing whitespace to be considered outside the PathSegment).
 * - when the context is a Path - this should only happen when the position is
 *   at the end of a Path immediately after a path-delimiter, so the completion
 *   should only replace the cursor position itself
 * 
 * @param context 
 * @param provider 
 * @returns 
 */
export const SearchPathSegmentCompletionSource:AdmbCompletionSource = (context:CompletionContext, provider:AdmbCompletionProvider) => {
   if (!context.explicit) {
      return NO_RESULT;
   }
   const search = findParent("SearchCommandExpression", context);
   if (search) {
      const appNode = search.getChild("Application");
      if (appNode != null) {
         const ctx = getContextNode(context);
         const adjacent = getLeftAdjacent(context);
         const ctxSegment = ctx?.name == "PathSegment" ? ctx :
                            adjacent?.name == "PathSegment" ? adjacent :
                            null || null;

         const app = text(appNode, context);
         const pathNodes = search.getChild("Path")?.getChildren("PathSegment") || [];
         const ctxSegmentPos = ctxSegment ? pathNodes.findIndex(p => nodeEquals(p, ctxSegment)) : undefined;
         const path = pathNodes.slice(0, ctxSegmentPos).map(n => text(n, context));
         const [from,to] = ctxSegment ? [ctxSegment.from, ctxSegment.to] : [context.pos, context.pos];
         return results(from, to, app, path, provider);
      }
   }

   return NO_RESULT;
}

function results(from:number, to:number, app:string, path:string[], provider:AdmbCompletionProvider):Promise<CompletionResult> {
   return provider.browseTree(app, path)
   .then(paths => paths.map(label => ({label})))
   .then(options => ({from, to, options}));
}