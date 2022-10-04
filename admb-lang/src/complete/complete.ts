import { CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { AdmbCompletionProvider, NoOpProvider } from "./provider";

import { CommandCompletionSource } from "./complete-command";
import { CommandNameCompletionSource } from "./complete-command.name";
import { DebuggingCompletionSource } from "./complete-debugger";
import { SearchApplicationCompletionSource } from "./complete-search.application";
import { SearchPathSegmentCompletionSource } from "./complete-search.pathsegment";

export type AdmbCompletionSource = (context:CompletionContext, provider:AdmbCompletionProvider) => Promise<CompletionResult|null>;

const sources = [
   CommandCompletionSource, 
   CommandNameCompletionSource,
   SearchApplicationCompletionSource,
   SearchPathSegmentCompletionSource,
   DebuggingCompletionSource
];
export function autocomplete(provider:AdmbCompletionProvider=new NoOpProvider()) {
   return (context:CompletionContext) => Promise.all(
      sources.map(source => source(context, provider))
   )
   .then(results => results.filter((r):r is CompletionResult => r != null))
   .then(merge)
}

function merge(results:CompletionResult[]) {
   return {
      from: Math.min(...results.map(r => r.from)),
      to: Math.min(...results.map(r => r.to).filter((to):to is number => to != undefined)),
      options: results.flatMap(r => r.options)
   }
}