import { CommandDescription } from "./api";

export const rangeIntersect:CommandDescription = {
    name: 'rangeIntersect',
    documentation: 'for each series (or each series in a group), select the subset of datapoints available across all series',
    arguments: [{
        name: 'scope',
        type: 'string',
        optional: true,
        documentation: 'either `group` (default - for legacy purposes) or `all`.'
    }]
}
