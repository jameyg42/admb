# Design Notes
CodeMirror autocomplete is designed to apply completions to the current
SyntaxNode.  The issue w/ this approach is that you need to start typing
*something* to initially create the SyntaxNode being completed!  There's
also some challenges in the construction of the language itself where
certain ambiguities are only resolved by characters a user MAY type in the
future.

This means instead of simply letting the parser tell us where we're at 
(what type of SyntaxNode we're in), we need a way to figure out the type
of production we're trying to complete from additional surrounding context.
This is where the CompletionSegment comes in - it's similar to a SyntaxNode
but can represent both an actual SyntaxNode or a SyntaxNode that will be
produced by the autocompletion itself.

We can run completions for the following types of productions
- Search.Application
- Search.Path.PathSegment
- Search.ValueType.Type (TBD)
- Search.ValueType.Baseline (TBD)
- Command
- Command.Arg.Name

If the cursor position either starts or ends a SyntaxNode that can be 
completed, we can simply run the respective completion....sortof...
Leading/trailing whitespace in certain node types (PathSegment..maybe others) 
may require or benefit from expanding the "range" of the SyntaxNode so slurp 
up the additional whitespace. While this "direct match" is likely faster, 
being "inside" a completable SyntaxNode ends up being the exception so we are 
NOT necessarily optimizing for it.  Instead, we'll "visit" each source in 
order and let it determine if it applies to the current position.  While it
may be possible to "pre-compute" certain data that is required for all sources,
for now we'll simply let each source do its own thing.

NOTE that it's possible that ambiguities in the language mean that we may need
to offer autocompletions from multiple sources at once.  For example, Command
vs. Application.  Because of this, we won't (currently) try to short-circuit
iterating across all the completion sources.

## Node Hierarchy
PipelineScript
   PipelineExpression
      SearchCommandExpression
         Application
         Path
            PathSegment*
         ValueType*!
            Type
            Baseline
      CommandExpression
         Command
         Arg*!
            Name!
            Value
