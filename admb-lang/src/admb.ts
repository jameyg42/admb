import { styleTags, tags as t } from "@lezer/highlight";
import { LRLanguage, LanguageSupport } from "@codemirror/language";
import { CompletionProvider, completionSource } from "./completion";
import { parser } from "@metlife/appd-pipeline/out/lang/pipeline.grammar";


const editorParser = parser.configure({
   props: [
      styleTags({
        Command: t.controlKeyword
      })
   ]
});

export const admbLanguage = LRLanguage.define({
   parser: editorParser,
   languageData: {
     commentTokens: {line: "//"}
   }
 })
 


 export function admb(provider?:CompletionProvider) {
   return new LanguageSupport(admbLanguage, [
    admbLanguage.data.of({autocomplete: completionSource(provider)})
   ])
 }


