import { CommandDescription } from "./api";

export const top:CommandDescription = {
    name: 'top',
    documentation: `
Picks the top N series ordered by the specified aggregator function (default is \`avg\`).
This is essentially short-hand for
    sort <fn> dir=desc|> limit <n> 
`,
    arguments:  [{
        name: 'size',
        type: 'number',
        documentation: 'the number of results to return (default is 10)',
        optional: true
    }, {
        name: 'by',
        type: 'string',
        documentation: `
the function used to reduce the values for each individual series.  
One of \`avg\`, \`avg\`, \`sum\`, \`min\`, \`max\`.
`,
        optional: true
    }]
}
