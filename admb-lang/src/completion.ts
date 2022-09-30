import { CompletionContext, CompletionResult, CompletionSource, Completion } from "@codemirror/autocomplete";
import { SyntaxNode } from "@lezer/common";
import { EditorState } from "@codemirror/state";
import * as processorDefs from '@metlife/appd-pipeline/out/lang/processor-defs';
import {syntaxTree} from "@codemirror/language"

// NOTE that certain language ambiguities are only resolved PAST the point of the autocompletion
// so we'll need to provide completions for multiple possibilities
const completionSources = {
  'PipelineScript': ifExplicit(merged(commandCompletions, appCompletions)),
  'PipelineExpression': ifExplicit(merged(commandCompletions, appCompletions)),
  'Command': merged(commandCompletions, appCompletions),
  'Value': noOp,
  'SearchCommandExpression': ifExplicit(searchCompletions),
  'Application': appCompletions,
  'Path': ifExplicit(pathSegmentCompletions),
  'PathSegment': ifExplicit(pathSegmentCompletions),
  'DEFAULT': noOp
} as ({[key:string]:AdmbCompletionSource})

type AdmbCompletionSource = (context:CompletionContext, provider:CompletionProvider) => Promise<Completion[]>;

function noOp(context:CompletionContext):Promise<Completion[]> {
  return Promise.resolve([]);
}
function ifExplicit(source:AdmbCompletionSource):AdmbCompletionSource {
  return (context:CompletionContext, provider:CompletionProvider) => {
    if (context.explicit) {
      return source(context, provider);
    }
    return Promise.resolve([]);
  }
}
function merged(...sources:AdmbCompletionSource[]):AdmbCompletionSource {
  return (context:CompletionContext, provider:CompletionProvider) => {
    return Promise.all(sources.map(source => source(context, provider)))
    .then(results => results
        .filter(r => r)
        .flatMap(r => r)
    )
  }
}
function bumped(source:AdmbCompletionSource):AdmbCompletionSource {
  return (context:CompletionContext, provider:CompletionProvider) => {
    return source(context, provider).then(result => result.map(r => {
      r.boost = 1;
      return r;
    }));
  }
}

function currentNode(context:CompletionContext):SyntaxNode|null {
  let node: SyntaxNode | null = syntaxTree(context.state).resolve(context.pos, -1)
  return node;
}
function findParent(node:SyntaxNode|null, named:string):SyntaxNode|null {
  while (node && named != node.name) {
    node = node.parent;
  }
  return node;
}
function text(node:SyntaxNode|null|undefined, context:CompletionContext):string|null {
  if (!node) return null;
  return context.state.sliceDoc(node.from, node.to);
}
const commandCompletionOptions = Object.values(processorDefs).map(def => ({
  label: def.name,
  info: def.documentation
} as Completion));
function commandCompletions(context:CompletionContext, provider:CompletionProvider): Promise<Completion[]> {
  return Promise.resolve(commandCompletionOptions);
}
function appCompletions(context:CompletionContext, provider:CompletionProvider): Promise<Completion[]> {
  return provider.browseApps()
    .then(apps => apps.map(label => ({ label })));
}
function searchCompletions(context:CompletionContext, provider:CompletionProvider): Promise<Completion[]>  {
  return pathCompletions(findParent(currentNode(context), "SearchCommandExpression"), context, provider);
}
function pathSegmentCompletions(context:CompletionContext, provider:CompletionProvider): Promise<Completion[]> {
  return pathCompletions(findParent(currentNode(context), "SearchCommandExpression"), context, provider);
}
function pathCompletions(searchExpression:SyntaxNode|null, context:CompletionContext, provider:CompletionProvider): Promise<Completion[]> {
  const app = text(searchExpression?.getChild("Application"), context);
  const paths = searchExpression?.getChild("Path")?.getChildren("PathSegment")
    .filter(p => p.from <= context.pos)
    .map(p => text(p, context))
    .slice(0,-1);
  if (app && paths) {
    return provider.browseTree(app, paths as string[])
      .then(segments => segments.map(label => ({ label })));
  }
  return Promise.resolve([]);
}

function completionSourceInternal(context: CompletionContext, provider:CompletionProvider): Promise<CompletionResult|null> {
  const node = currentNode(context);
  console.log(node?.type.name);
  const source = completionSources[node?.name || 'DEFAULT'] || noOp;
  return source(context, provider)
        .then(options => ({from: node?.from != undefined ? node.from : context.pos, options}));
}




export function completionSource(provider:CompletionProvider=new NoOpProvider()) {
  return (context:CompletionContext) => {
    return completionSourceInternal(context, provider);
  }
}

export interface CompletionProvider {
  browseApps():Promise<string[]>;
  browseTree(app:string, path:string[]):Promise<string[]>;
}

// if we don't have a provider, we simply won't try to autocomplete apps or paths
class NoOpProvider implements CompletionProvider {
  browseApps():Promise<string[]> {
    return Promise.resolve([]);
  }
  browseTree(app:string, path:string[]):Promise<string[]> {
    return Promise.resolve([]);
  }
}