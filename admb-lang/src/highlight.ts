import { styleTags, tags as t } from "@lezer/highlight";

export const admbHighlight = styleTags({
   Command: t.function(t.controlKeyword),
   comment: t.comment,
   number: t.number,
   string: t.string,
   "[ ]": t.squareBracket,
   "{ }": t.brace,
   ", ;": t.separator,
   "= @": t.operator,
   pipeOps: t.operator
});
