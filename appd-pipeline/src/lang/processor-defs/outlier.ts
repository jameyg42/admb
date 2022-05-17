import { CommandDescription } from "./api";

export const outlier:CommandDescription = {
    name: 'outlier',
    documentation: `
    Elimates outlier values in each individual timeseries by fencing the set of values withing the inter-quartile range. NOTE that currently both the
    high and low values are filtered out.   
    `,
    arguments: []
};
