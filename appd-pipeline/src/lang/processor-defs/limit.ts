import { CommandDescription } from "./api";

export const limit:CommandDescription = {
    name: 'limit',
    documentation: `
    Limits the number of series in each result group by including only the first N series in the group and removing the rest.
    Useful when combined with \`filter\`.
    `,
    arguments: [{
        name: 'amount',
        type: 'number',
        documentation: 'the number of series to keep in the group'
    }]
}
