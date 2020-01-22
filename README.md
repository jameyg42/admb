# AppDynamics Metrics Browser (ADMB) - WebUI Version

## Overview
Syntax Version ALPHA3

ADMB is an alternative way to browse the AppDynamics metrics tree.  The system consists of a search expression
syntax used to query the metrics tree, and a transformation pipeline syntax that can be used to perform various
transforms on the discovered metrics - collectively, the search expressions and pipeline commands are simply
referred to as "pipeline expressions".

## General Syntax
    <pipeline-expr>:
       <search-expr> |> <pipeline-cmds> |
       <pipeline-expr> |> [ <pipeline-expr> ]    # subsearch
    <search-expr>
       <metric-path> |
       <metric-path>;<metric-paths>
    <pipeline-cmds>
       <command> <arguments> |
       <command> <arguments> |> <pipeline-cmds | subsearch>

for example

    Overall Application Performance|*|Individual Nodes|*|Calls per Minute
    |> groupBy segment=2 |> groupBy segment=4
    |> reduce fn=avg

NOTE that a formal grammar can be found in `appd-services-js/lib/metrics/pipeline/pipeline-grammar.ne`.

## Search Expressions - Paths and Wildcards
A search expression is an AppDynamics metrics path containing zero or more wildcard expressions.  As defined by
AppDynamics itself, a metric path is a pipe delimited (`|`) series of node names from the root of the metric
tree to the metric being searched for.  These are the paths that can be copied from the AppDynamics metrics browser
by right clicking on the metric and selecting "Copy Full Path".  Path segments can be either a node name, or a
wildcard expression.  The following wildcards are supported (note that wildcards only match individual node segments - 
they will never match beyond a pipe):
### Asterix
An asterix (`*`) matches zero or more characters.  It's a non-greedy match, so you can have more than one asterix wildcard
in a single path segment.  It's functionally equivalent to the regex `.*?`
### Question mark
A question mark (`?`) matches exactly one character.  It's functionally equivalent to the regex `.`.
### Alternation List
Comma-separated values within curly braces ({foo,bar,...}) are treated as alternative value lists, and match if any of the 
values matches the current point in the path. For example, 

    `Overall Application Performance|{app_tier,web_tier}|Calls per Minute`.

It's functionally equivalent to the regex `(?:(?:opt1)|(?:opt2))`.

### Application Specifier
language stability: low (likely to change in the future)

The application(s) a search expression executes in the context of can be optionally specified using the following syntax:

    app=<app-expression> <metric-path>

where `app-expression` is an application name, optionally with wildcards.  The `app-expression` must proceed the `metric-path`,
otherwise it will be considered part of the metric path itself.

### A Note on Quoting
Metric paths and argument values can optionall be quoted either as 'single quoted' or "double quoted" strings.  The grammar
tries to minimize the need for using quotes, but occasionally such needs arise.  It's always safe to use quotes for paths and
values, but it's generally preferred to use them only when required.

## Subsearches
A subsearch is a special form of pipeline command that takes a complete pipeline-expression as an argument.  The results of
this "embedded" pipeline-expression are concatenated to the current search.  Subsearches can be embedded inside other subsearches.

A subsearch takes the form

    |> [ <subsearch-pipeline-expression> ]

that is, you pipe the current search results to a `[ <subexpression> ]` (square brackets included).  For example,

    Overall Application Performance|*|Average Response Time (ms)
    |> label ${s[2]}-RT
    |> [
      Overall Application Performance|*|Calls per Minute 
      |> label ${s[2]}-CPM
      |> plot yaxis=2 type=bar
    ] 
    |> groupBy segment=2

## Pipeline Commands
Pipeline commands consist of a command name and zero or more arguments.  Arguments can be either named or positional - although 
there's a formal way to handle mixing named and positional arguments, a) it's best to avoid mixing and b) it's best to use named
parameters *unless* a command only takes a single argument.  NOTE that argument values may need to be quoted, especially if the 
value contains spaces in it - if left unquoted, the grammar will treat spaces as a delimiter between a named and unnamed parameter.

### groupBy
Groups individual metric series together.  Grouping is useful step before a subsequent operator that operates on groups, such as `reduce`.
It's also useful in the WebUI since groups are plotted individually.

Syntax:

    groupBy [segment=#] [rex=<regex>]

- segment - a segment of the metric path, starting at 1
- rex - a regular expression - grouping is done using capture groups, where identical values for the concatenation of all the specified 
        capture groups are grouped together.

### flatten
Flattens groups - that is, combines all the individual grouped series into a single group for the current pipeline expression.  NOTE that
currently this is always a "deep" flatten, but only for the current pipeline expression (i.e. if used in a subsearch, only the subsearch
results are flattened into a single group).

Syntax:

    flatten

### reduce
Reduces all the series in each group to an individual series using a specified reducer function.  NOTE that reducers don't reduce the points
in an individual series, but rather all the points for a given moment for all the series included in each group.  

Syntax:

    reduce fn=<reducer>

- fn - the reducer function to use.  The following reducer functions are supported:
  * avg - averages all the values in the series together
  * sum - sums the values together
  * product - multiplies the values together
  * diff - subtracts each subsequent series value from the first series
  * quotient - divides each subsequent series value from the first series

NOTE that for `diff` and `quotient`, the "first series" is currently and often difficult to control.  See `sort` for more information.

### scale
Scales each value in each series by a specified factor.

Syntax:

    scale factor=#

 - factor - the numeric factor to scale by

### percentOf
Takes the percentage of each subsequent series relative to the first series in each group.  See `sort` for more information.
Syntax:
    percentOf

### sort
language stability: very low (almost certain to change in future release)

Sorts the series in each group.  NOTE that sort is currently inconsistent with similar commands, such as `label` which take
javascript expressions.

Syntax:

    sort [by=<expr>] [dir=asc|desc]

- by - the sorting operation, defaulting to "name" if not specified.  Operations may optionally take one or more arguments, provided
  in the form `command[arguments]` (i.e. wrapped in square brackets).
  The following operations are currently supported:
     * avg - the average of all the points in each series - no arguments
     * name - the metric full name or portion of the full name extracted using the caputure groups of a regular expression provided as
       an argument (i.e. `by=name[(RISC|SISC)])`)  
     * segment - the path segment specified by the index argument (i.e. `by=segment[7]`)
- dir - the sort direction, defaulting to asc(ending) for name and segment operators, and desc(ending) for the avg operator

### filter / filterGroup
Filters (removes non-matching) series or entire groups from the results.

Syntax:

    filter expr=<js-expr>
    filterGroup matching=<some|every|<name-match>> expr=<js-expr>

- expr - a javascript expression that must evaluate to true (series/group included) or false (series excluded). The following variables
  are available to the expression:
    * min / max / avg - the minimum/maximum/average value for the entire series
    * name/fullName - the short/full metric name
    * ts - advanced - the entire timeseries object (see appd-services-js/lib/metrics/normalize.js for more information)
    * ctx - advanced - the pipeline execution context (see appd-services-js/lib/metrics/pipeline/pipeline.js for more information)
- matching - for `filterGroup`, whether all series need to evaluate to true for the group to be included (`every`), at least one series (`some`),
  or all the series matching the specified name expression (the metricFullName with optional wildcards)

### outlier
Elimates outlier values in each individual timeseries by fencing the set of values withing the inter-quartile range. NOTE that currently both the
high and low values are filtered out.

Syntax:

    outlier

### label
Renames series

Syntax:

    label expr=<label-expr>

- expr - a javascript template literal that will set the series metricName and metricFullName.  Variables available to the template expression are:
    * s - an array of path segments (shorcut to ts.node.metricPath) - NOTE that operators that function on groups creating new series do not currently 
          set the metric path (such as `reduce`).  
    * name/fullName - the metric name / full name - NOTE that since the expression is a javascript template literal, the template can contain
          regular expressions that extract a portion of the name (i.e. `${/some(pattern)/.exec(fullName)[1]}`)
    * ts - advanced - the full timeseries object
    * ctx - advanced - the pipeline execution context (NOTE that `${ctx.app.name}` may be especially useful)

### derivative
Calculates the difference between each subsequent data point. 

Syntax:

    derivative

### plot
language stability: enhancements coming soon

Sets metadata that is used by the WebUI's plot component.

Syntax:

    plot [type=line|bar|stacked-bar] [yaxis=1|2] 

- type - the type of plot - defaults to line
- yaxis - the yaxis to plot the series on - defaults to 1


