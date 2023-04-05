import { LRLanguage, LanguageSupport } from "@codemirror/language";
import { parser } from "@admb/pipeline/out/lang/pipeline.grammar";
import { admbHighlight } from "./highlight";
import { CompletionContext } from "@codemirror/autocomplete";
import { getContextNode, getLeftAdjacent } from "./complete/tree-utils";
import { AdmbCompletionProvider, autocomplete } from "./complete";

// the ADMB language pack 
export const admbLanguage = LRLanguage.define({
  parser:  parser.configure({
    props: [
     admbHighlight
    ]
  }),
  languageData: {
    commentTokens: {line: "//"}
  }
});


const debug = (context:CompletionContext) => {
  const node = getContextNode(context);
  console.log(context.pos, node?.name, getLeftAdjacent(context)?.name);
}

export function admb(provider?:AdmbCompletionProvider) {
  return new LanguageSupport(admbLanguage, [
   admbLanguage.data.of({autocomplete: autocomplete(provider)})
  ])
}
