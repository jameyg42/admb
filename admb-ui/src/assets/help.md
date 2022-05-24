<a href="https://devtools.metlife.com/bitbucket/users/jgraham/repos/appd-browser-webui/browse/README.md" target="_blank">Full Readme</a>
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
       an argument (i.e. `by=name[(RISC|SISC)])`)  
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

