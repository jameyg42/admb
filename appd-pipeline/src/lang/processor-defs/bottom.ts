import { CommandDescription } from "./api";

export const bottom:CommandDescription = {
    name: 'bottom',
    documentation: 'Finds the bottom (smallest reduced value) series in each group. NOTE that this does not transform the series in any way.',
    arguments:  [{
        name: 'size',
        type: 'number',
        documentation: 'the number of results to return (default is 10)',
        optional: true
    }, {
        name: 'by',
        type: 'string',
        documentation: 'the function used to reduce the values for each individual series.  One of `avg`, ',
        optional: true
    }]
};
