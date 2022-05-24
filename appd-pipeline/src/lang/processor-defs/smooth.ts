import { CommandDescription } from "./api";

export const smooth:CommandDescription = {
    name: 'smooth',
    documentation: 'Smooths a jaggedy timeseries, currently using moving average across a specified window.',
    arguments: [{
        name: 'window',
        type: 'number',
        optional: true,
        documentation: 'the size of the window in # of datapoints to use in the moving average'
    }]
};
