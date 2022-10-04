import { CompletionContext, CompletionResult, CompletionSource, Completion } from "@codemirror/autocomplete";
import { SyntaxNode } from "@lezer/common";

import {syntaxTree} from "@codemirror/language"
import { AdmbCompletionProvider, NoOpProvider } from "./provider";
export { AdmbCompletionProvider } from "./provider";

type AdmbCompletionSource = (context:AdmbCompletionContext, provider:AdmbCompletionProvider) => Promise<Completion[]>;
export interface AdmbCompletionSegment {
  type: string;
  from: number;
  to: number;
  text: string;
}
export interface AdmbCompletionContext {
  segment: AdmbCompletionSegment;
  parent: SyntaxNode;
  original: CompletionContext;
}

const completionSources = {
  'Command': merged(commandCompletions, appCompletions),
  'Name': nameCompletions,
  'Application': appCompletions,
  'PathSegment': ifExplicit(pathCompletions)
} as ({[key:string]:AdmbCompletionSource})


function completionSourceInternal(context: CompletionContext, provider:CompletionProvider): Promise<CompletionResult|null> {
  // we often need to complete a node that doesn't actually exist yet (we haven't started typing anything)
  // 
  const derived = deriveContext(context);
  if (derived == null) {
    return Promise.resolve(null);
  }
  
  const source = completionSources[derived.type || 'DEFAULT'] || noOp;
  return source(derived, provider)
        .then(options => ({
          from: derived.from,
          to: derived.to,
          options,
          validFor: /[^/\|\[,>=]*/
        }));
}


function deriveContext(context:CompletionContext):AdmbCompletionContext|null {
  const tree = syntaxTree(context.state);
  const starts = tree.resolve(context.pos, 1);
  const ends = tree.resolve(context.pos, -1);
  console.log(
    'starts', starts.name,
    'ends', ends.name,
  );

  // if we're starting/inside/ending a node that can be directly autocompleted, then
  // just complete based on that node....
  const directCompletion = completionSources[starts.name] || completionSources[ends.name];
  if (directCompletion !== undefined) {
    return derivedFrom(completionSources[starts.name] !== undefined ? starts : ends, context);
  }

  //...otherwise we need to figure out what we're trying to complete.  First,
  // find the last node separated only by whitespace
  let previousNonWhitespacePos = context.pos;
  for (;previousNonWhitespacePos > 0 && context.state.doc.sliceString(previousNonWhitespacePos-1, previousNonWhitespacePos) == ' '; previousNonWhitespacePos--);
  const previous = tree.resolve(previousNonWhitespacePos, -1);
  console.log('previous', previous.name);
  if (previous.name == 'PathSegment') {
    const segment = derivedFrom(previous, context);
    segment.to = context.pos;
    return segment;
  }
  if (previous.name == 'Path') {
    return {
      type: 'PathSegment',
      from: context.pos,
      to: context.pos,
      parent: previous as SyntaxNode,
      original: context
    }
  }
  if (previous.name == 'Command') {
    return {
      type: 'Name',
      from: context.pos,
      to: context.pos,
      parent: previous.parent as SyntaxNode,
      original: context
    }
  }






  return null;
}

function derivedFrom(node:SyntaxNode, context:CompletionContext):AdmbCompletionContext {
  return {
    type: node.name,
    from: node.from,
    to: node.to,
    parent: node.parent || node,
    original: context
  };
}



export function completionSource(provider:CompletionProvider=new NoOpProvider()):CompletionSource {
  return (context:CompletionContext) => {
    return completionSourceInternal(context, provider);
  }
}





