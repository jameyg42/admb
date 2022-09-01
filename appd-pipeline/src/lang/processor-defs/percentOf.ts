import { CommandDescription } from "./api";

export const percentOf:CommandDescription = {
    name: 'percentOf',
    documentation: 'Takes the percentage of each subsequent series relative to the `what` series in the group.  See `reduce` for more information.',
    arguments: [{
        name: 'what',
        type: 'string',
        documentation: `
a regex used to match the timeseries in the group to use as the basis for percentages-of.  The first matching
series is used (default is to match all series).  NOTE that the default order of the series is somewhat 
nondeterministic even across multiple executions of the same search - you may need to add a \`sort\` to the 
pipeline to guarantee the \`what\` being used.
`,
        optional: true
    }]
};
