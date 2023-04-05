# AppDynamics Metrics Browser (ADMB) - WebUI Version

## Overview
Syntax Version 1.9.0-TRANSITIONAL (experimental)

ADMB is an alternative way to browse the AppDynamics metrics tree.  The system consists of a search expression
syntax used to query the metrics tree, and a transformation pipeline syntax that can be used to perform various
transforms on the discovered metrics - collectively, the search expressions and pipeline commands are simply
referred to as "pipeline expressions".

## General Syntax
    <search-expression> |> <pipeline-operator>

    <search-expression>
       <app-with-globs>:|<metric-path-with-globs>

    <glob>
       * wildcard - match multiple any char
       ? match single any char
       {option1, opti*n2}
    
example: 
    
    8911*:|Overall*|*|{Calls per*, Errors per*} |> groupBy 2 |> percentOf


## Semi-Formal Syntax
    <pipeline-expr>:
       <search-expr> <pipeline-op> <pipeline-cmds> |
       <pipeline-expr> <pipeline-op> [ <pipeline-expr> ]    # subsearch
    <search-expr>
       <metric-path> |
       <metric-path>;<metric-paths>
    <metric-path>
       <app-selector>:<path-delim><nodes>[<value-selector>(opt)]
    <app-selector>
       <glob>
    <path-delim>
       one-of |, /, ~, !, $, %, ^
    <nodes>
       <glob> |
       <glob><path-delim><nodes>
    <value-selector>  - optional - default is [value]
       one of value, min, max, sum, count |
       one of baseline@<baseline>, stddev@<baseline>
    <pipeline-cmds>
       <command> <arguments> |
       <command> <arguments> <pipline-op> <pipeline-cmds | subsearch>
    <pipeline-op>
       one of |>, />, >>


for example

    8911*:/Overall*/*/Individual Nodes/*/Calls per Minute
    |> groupBy segment=2 |> groupBy segment=4
    >> reduce fn=avg

NOTE that a formal grammar can be found in `admb-pipeline/src/lang/pipeline.grammar`.

## Search Expressions - Paths and Wildcards
A search expression is an AppDynamics app followed by a metrics path containing zero or more wildcard expressions.  
A metric path is a delimited  series of node names from the root of the metric tree to the metric being searched for.  
These are the paths that can be copied from the AppDynamics metrics browser by right clicking on the metric and 
selecting "Copy Full Path".  Path segments can be either a node name, or a wildcard expression.  The following wildcards 
are supported (note that wildcards only match individual node segments - they will never match beyond a pipe):
### Asterix
An asterix (`*`) matches zero or more characters.  It's a non-greedy match, so you can have more than one asterix wildcard
in a single path segment.  It's functionally equivalent to the regex `.*?`
### Question mark
A question mark (`?`) matches exactly one character.  It's functionally equivalent to the regex `.`.
### Alternation List
Comma-separated values within curly braces ({foo,bar,...}) are treated as alternative value lists, and match if any of the 
values matches the current point in the path. For example, 

    Overall Application Performance|{app_tier,web_tier}|Calls per Minute

It's functionally equivalent to the regex `(?:(?:app_tier)|(?:web_tier))`.


## Subsearches
A subsearch is a special form of pipeline command that takes a complete pipeline-expression as an argument.  The results of
this "embedded" pipeline-expression are concatenated to the current search.  Subsearches can be embedded inside other subsearches.

A subsearch takes the form

    |> [ <subsearch-pipeline-expression> ]

that is, you pipe the current search results to a `[ <subexpression> ]` (square brackets included).  For example,

    8911*:|Overall Application Performance|*|Average Response Time (ms)
    |> label %s[2]-RT
    |> [
      8911*:|Overall Application Performance|*|Calls per Minute 
      |> label %s[2]-CPM
      |> plot yaxis=2 type=bar
    ] 
    |> groupBy segment=2

## Pipeline Commands
Pipeline commands consist of a command name and zero or more arguments.  Arguments can be either named or positional - although 
there's a formal way to handle mixing named and positional arguments, a) it's best to avoid mixing and b) it's best to use named
parameters *unless* a command only takes a single argument.  NOTE that argument values may need to be quoted, especially if the 
value contains spaces in it - if left unquoted, the grammar will treat spaces as a delimiter between a named and unnamed parameter.

## Metrics Series
Metric searches return zero or more metric series.  Unlike AppDynamics' MetricSeries where each timeseries data point contains
multiple values (value, min, max, etc), ADMB data points only contain the single value specified by the <value-selector> in the
search expression.  If multiple values are specified in the value selector, multiple series are returned.

## Understanding Groups and the "flatten -> (re)group" Pattern
Individual metric series exist in series groups.  Groups are formed either by each `metric-path` in a `search-expression` 
(including subsearches) or via the `groupBy` operator. Grouping is useful both because operators such as `reduce` operate 
on all the series in the group and the WebUI plots each group in a separate timeseries chart.

The `flatten` operator is used to collapse all the individual groups for the current search into a single group that holds all 
series.  

It's a common pattern to create a bunch of groups, operate on them (either via `reduce` or via subsearches), flatten the
groups, then re-group under some different dimension.  For example...

    8911*:|Overall*|*|Individual Nodes|*|Calls per Minute
    |> [ 
       8911*:|Overall*|*|Individual Nodes|*|Calls per Minute[baseline@WEEKLY]
       |> groupBy segment=2
       |> groupBy rex=(SEA|NYC)
       |> reduce avg
       |> plot vals=baseline type=dashed
    ]
    |> flatten
    |> groupBy segment=2
    |> groupBy rex=(SEA|NYC)

Our first search just pulls all the CPM metrics for each individual node into a group.  Our subsearch then pulls the 
individual nodes CPMs (again) including the baseline metrics, groups by tier, then groups by datacenter name (using a 
regular expression).  We then average all values in each subsearch group giving us per-tier/per-datacenter average CPMs 
and set the series in the subsearch groups to plot the baseline as a dashed line.  Since we want to display the per-datacenter
averages against the individual node actuals, we first need to flatten the results into a single group so we can subsequently
re-group then per-tier/per-datacenter.

This group->operate->flatten->regroup sequence is common when building more complex queries.

### groupBy
Groups individual metric series together. 

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
  * min - picks the min value
  * max - picks the max value

NOTE that for `diff` and `quotient`, the "first series" is currently and often difficult to control.  One method is to use a search to
pick the first series, and a subsearch to pick all subsequent series, then flatten the results (flattening will preserve series order).
Alternatively `sort` may be able to be used.

### scale
Scales each value in each series by a specified factor.

Syntax:

    scale factor=#

 - factor - the numeric factor to scale by

### percentOf
Takes the percentage of each subsequent series relative to the first series in each group.  See `reduce` for more information.
Syntax:
    percentOf

### invert
Invert (1 / x) every value in the series.

Syntax:

     invert

### log
Take the natural log of each value in the series

Syntax:

    log

### e
Raises each value in the series to 'e' (the base for natural logarithms)

Syntax:

    e

### sqrt
Takes the square root of each value in the series.

Syntax:

    sqrt

### offset
Adds a given value to each value in the series.

Syntax:

    offset <n>

- n - the offset distance added to each series value

### toZero
Offsets each value in a series by the minimum value in the series, "flooring" the minimum value in the series at zero.

Syntax:

    toZero

### sort
Sorts the series in each group. 

Syntax:

    sort [by=<expr>] [dir=asc|desc]

- by - the sorting operation, defaulting to "name" if not specified.  Operations may optionally take one or more arguments, provided
  in the form `command[arguments]` (i.e. wrapped in square brackets).
  The following operations are currently supported:
     * avg - the average of all the points in each series - no arguments
     * name - the metric full name or portion of the full name extracted using the caputure groups of a regular expression provided as
       an argument (i.e. `by=name[(SEA|NYC)])`)  
     * segment - the path segment specified by the index argument (i.e. `by=segment[7]`)
- dir - the sort direction, defaulting to asc(ending) for name and segment operators, and desc(ending) for the avg operator

### fill
Fill in gaps of missing data, currently using simple linear interpolation between gap edges.  NOTE that AppDynamics doesn't
always differentiate between a gap and a zero, so all gaps are currently represented as zeros.  This could skew aggregator
functions (see `filter` and `sort`).  Zero vs. gap handling will be improved in the future, but for now you may need to
`fill` in the gaps for sorting/filtering to work correctly.

Syntax:

    fill

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

### limit
Limits the number of series in the current group by including only the first N series in the group and removing the rest.  
Useful when combined with `filter`.

Syntax:

    limit <n>

  - n - the number of series to keep in the group

### top
Picks the top N series ordered by the specified aggregator function (default is `avg`).  This is essentially short-hand for

    sort <fn> dir=desc|> limit <n>

Syntax:

   top <n> by=<avg,sum,min,max>

- n - the number of series to keep
- by - the sorting function (see `sort`)

### bottom
Picks the bottom N series ordered by the aggregator function.  This is essentially short-hand for

    sort <fn> dir=asc |> limit <n>

Syntax:

   bottom <n> by=<avg,sum,min,max>

- n - the number of series to keep
- by - the sorting function (see `sort`)


### outlier
Elimates outlier values in each individual timeseries by fencing the set of values withing the inter-quartile range. NOTE that currently both the
high and low values are filtered out.

Syntax:

    outlier

### label
Renames series

Syntax:

    label expr=<label-expr>

- expr - a string expression that will set the series metricName and metricFullName.  Variables available to the template expression are:
    * s - an array of path segments (shorcut to ts.node.metricPath) - NOTE that operators that function on groups creating new series do not currently 
          set the metric path (such as `reduce`).  
    * name/fullName - the metric name / full name 
    * app - the app name
    * args - the label command's argument (not useful)
    * ts - advanced - the full timeseries object
    * ctx - advanced - the pipeline execution context (NOTE that `%{ctx.app.name}` may be especially useful)


### plot
Sets metadata that is used by the WebUI's plot component.

Syntax:

    plot [type=line|bar|stacked-bar] [yaxis=1|2] [vals=value|min|max|baseline|stddev]

- type - the type of plot - defaults to line
- yaxis - the yaxis to plot the series on - defaults to 1

### threshold
Creates a new series equal in length to the largest series in the group with a given fixed value (e.g. draws a 
horizontal line).  NOTE that the series created using threshold is a true series included in the group and will
be affected by any additional tranforms conducted on the series in the group.

Syntax:

    threshold <n>

- n - the value of the threshold line

### derivative
Calculates the difference between each subsequent data point.   Inverse of `integral`.

Syntax:

    derivative

### intergral
Continually sums each subsequent data point.  Inverse of `derivative`.

Syntax:

    integral

### ceil
Sets a ceiling for the metric value.  Any value exceeding the specified ceiling value is set to the ceiling value.

Symtax:

    ceil value=<ceiling>

- ceiling - the maximum value


### floor
Sets the floor for the metrics value.  Any value less than the specified floor value is set to the floor value.

Syntax:

    floor value=<floor>

- floor - the minimum value

### abs
Sets the absolute value for each value in the series.  Useful when combined with `derivative` to show the change regardless
of sign.

Syntax:

   abs

## binary
0 if the value is 0; otherwise 1.

Syntax:

   binary

#### normalize
Applies min/max normalizion for each value in the series.  Normalizing is useful when comparing multiple series that are scaled
differently (i.e. calls per minute vs. response time) to show how a change in one value impacts a change in another value since
all values are automatically scaled to a value between 0 and 1.

Syntax:

    normalize

### smooth
Smooths a jaggedy timeseries, currently using moving average across a specified window.

Syntax

    normalize [window=<datapoints>]

- window - the size of the window in # of datapoints to use in the moving average

### shift
Shifts the time of each data point by a given value.  Durations are expressed in a human readable form
as defined by https://github.com/jkroso/parse-duration.  Positive durations shift to the future; negative
to the past.  NOTE that shifting does not change the range of data fetched from AppDynamics - shifting
instead just adds/subtracts a value from the timestamps of the series leaving a gap at the start/end of 
the series compared to the range the data was fetch with depending on the direction data is shifted.  

For example:
    shift "-2m"

Syntax:

    shift <duration>

