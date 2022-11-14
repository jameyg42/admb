import { CompletionContext } from "@codemirror/autocomplete";
import { SyntaxNode } from "@lezer/common";
import { syntaxTree } from "@codemirror/language"
import { EditorState } from "@codemirror/state";

export const NO_RESULT = Promise.resolve(null);

export function getAdjoining(state:EditorState, pos:number):SyntaxNode[] {
  const tree = syntaxTree(state);
  const starts = tree.resolve(pos, 1);
  const ends = tree.resolve(pos, -1);

  return [starts,ends];
}

const Ignorable = /PipelineExpression|PipelineScript/;
export function isIgnored(node:SyntaxNode):boolean {
  return Ignorable.test(node.name);
}
export function getNode(state:EditorState, pos:number):SyntaxNode|null {
  const [start,end] = getAdjoining(state, pos);
  return !isIgnored(start) ? start : !isIgnored(end) ? end : null;
}
export function getContextNode(context:CompletionContext):SyntaxNode|null {
  return getNode(context.state, context.pos);
}

export function getLeftAdjacent(context:CompletionContext):SyntaxNode|null {
  let pos = context.pos;
  while(charAt(pos, context.state) === ' ') pos--;
  const left = getAdjoining(context.state, pos)[1];
  return isIgnored(left) ? null : left;
}

export function findParent(parentType:string, context:CompletionContext):SyntaxNode|null {
  let ctx = getContextNode(context) || getLeftAdjacent(context);
  while (ctx != null) {
    ctx = ctx.parent;
    if (ctx?.name === parentType) {
      return ctx;
    }
  }
  return null;
}
export function findSibling(parentType:string, siblingType:string, context:CompletionContext):SyntaxNode|null {
  const parent = findParent(parentType, context);
  return parent?.getChild(siblingType) || null;
}


export function charAt(pos:number, state:EditorState):string {
  if (pos == 0) return '';
  return state.sliceDoc(pos-1, pos);
}


export function text(node:SyntaxNode, context:CompletionContext):string {
  return context.state.sliceDoc(node.from, node.to);
}

export function nodeEquals(a:SyntaxNode, b:SyntaxNode) {
  return a.from === b.from && a.to === b.to;
}
