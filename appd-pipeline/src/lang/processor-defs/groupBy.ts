import { CommandDescription } from "./api";

export const groupBy:CommandDescription = {
    name: 'groupBy',
    documentation: 'Groups individual metric series together.',
    arguments: [{
        name: 'segment',
        type: 'any',
        optional: true,
        documentation: 'a segment of the metric path, starting at 1, or `app` to group by the app'
    }, {
        name: 'rex',
        type: 'string',
        optional: true,
        documentation: `
        a regular expression - grouping is done using capture groups, where identical values for the concatenation 
        of all the specified capture groups are grouped together.
        `
    }]
}
