import { CompletionContext } from "@codemirror/autocomplete";
import { AdmbCompletionSource } from "./complete";
import { AdmbCompletionProvider } from "./provider";
import { getContextNode, getLeftAdjacent, NO_RESULT } from "./tree-utils";

export const DebuggingCompletionSource:AdmbCompletionSource = (context:CompletionContext, provider:AdmbCompletionProvider) => {
   console.log('context', getContextNode(context)?.name, 'adjacent', getLeftAdjacent(context)?.name);
   return NO_RESULT;
}