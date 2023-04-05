import { CommandDescription } from "./api";

export const lift:CommandDescription = {
  name: 'lift',
  documentation: 'Lifts (moves) matching series from the parent pipeline to the current.  This is only useful from sub-pipelines.',
  arguments: [{
    name: 'expr',
    type: 'string',
    optional: true,
    documentation: `
a javascript (currently) expression that must evaluate to true (series/group included) or false (series excluded). The following variables
are available to the expression:
* min / max / avg - the minimum/maximum/average value for the entire series
* name/fullName - the short/full metric name
* ts - advanced - the entire timeseries object (see appd-services-js/lib/metrics/normalize.js for more information)
* ctx - advanced - the pipeline execution context (see appd-services-js/lib/metrics/pipeline/pipeline.js for more information)
`
  }, {
    name: 'deep', 
    type: 'boolean',
    optional: true,
	  documentation: 'true if we should copy from all parents; false if only from the immediate parent'
	}]
};
