function appCompletions(context:AdmbCompletionContext, provider:CompletionProvider): Promise<Completion[]> {
   return provider.browseApps()
     .then(apps => apps.map(label => ({ label })));
 }
 function pathCompletions(context:DerivedContext, provider:CompletionProvider): Promise<Completion[]> {
   const node = currentNode(context);
   const searchExpression = findParent(node, "SearchCommandExpression");
   const app = text(searchExpression?.getChild("Application"), context);
   const paths = searchExpression?.getChild("Path")?.getChildren("PathSegment")
     .filter(p => p.from <= context.pos)
     .map(p => text(p, context))
     .slice(0, node?.type.name == "Path" ? undefined : -1);
   if (app && paths) {
     return provider.browseTree(app, paths as string[])
       .then(segments => segments.map(label => ({ label })));
   }
   return Promise.resolve([]);
 }