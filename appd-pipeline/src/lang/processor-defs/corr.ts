import { CommandDescription } from "./api";

export const corr:CommandDescription = {
    name: 'corr',
    documentation: 'Computes the correlation coefficient for each series relative to each other.',
    arguments: [{
        name: 'window',
        type: 'number',
        optional: true,
        documentation: 'if specified, the number of datapoints to include to compute a correlation point.'
    }]
}
