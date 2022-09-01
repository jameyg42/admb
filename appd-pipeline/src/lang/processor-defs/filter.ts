import { CommandDescription } from "./api";

export const filter: CommandDescription = {
    name: 'filter',
    documentation: 'Filters (removes non-matching) series from the results.',
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
    }]
}
