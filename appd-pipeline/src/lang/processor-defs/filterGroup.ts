import { CommandDescription } from "./api";

export const filterGroup:CommandDescription = {
    name: 'filterGroup',
    documentation: 'Filters (removes non-matching) entire groups from the results if a/all series in the group natches the expression.',
    arguments: [{
        name: 'expr',
        type: 'string',
        documentation: `
        a javascript (currently) expression that must evaluate to true (series/group included) or false (series excluded). The following variables
        are available to the expression:
          * min / max / avg - the minimum/maximum/average value for the entire series
          * name/fullName - the short/full metric name
          * ts - advanced - the entire timeseries object (see appd-services-js/lib/metrics/normalize.js for more information)
          * ctx - advanced - the pipeline execution context (see appd-services-js/lib/metrics/pipeline/pipeline.js for more information)
        `
    }, {
        name: 'matching',
        type: 'string',
        documentation: `
        whether all series need to evaluate to true for the group to be included (\`every\`), at least one series (\`some\`),
        or all the series matching the specified name expression (the metricFullName with optional wildcards)
        `
    }]
}
