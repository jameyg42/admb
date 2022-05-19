import { CommandDescription } from "./api";

export const relativeTo:CommandDescription = {
    name: 'relativeTo',
    documentation: `
    For each current series, perform a new search relative to the path of the current series.
    For now, the relative path *must* be expressed as a string in the form
       ../../someMetricNode/someMetric
    or
       ..|..|someMetricNode|someMetric
    alternatively, paths can be relative to the application by starting the relative
    path with '/' or '|'.
    `,
    arguments: [{
        name: 'path',
        type: 'string',
        documentation: 'the relative path'
    },{
        name: 'mode',
        type: 'string',
        optional: true,
        documentation: 'how results are merged in.  One of merge (default) or replace.'
    }]
}
