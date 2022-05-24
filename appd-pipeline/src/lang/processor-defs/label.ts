import { CommandDescription } from "./api";

export const label:CommandDescription = {
    name: 'label',
    documentation: 'Renames series',
    arguments: [{
        name: 'expr',
        type: 'string',
        documentation: `
        a string expression that will set the series metricName and metricFullName.  Variables available to the template expression are:
        * s - an array of path segments (shorcut to ts.node.metricPath) - NOTE that operators that function on groups creating new series do not currently 
              set the metric path (such as \`reduce\`).  
        * name/fullName - the metric name / full name 
        * app - the app name
        * args - the label command's argument (not useful)
        * ts - advanced - the full timeseries object
        * ctx - advanced - the pipeline execution context (NOTE that \`%{ctx.app.name}\` may be especially useful)
        `
    }]
}
