import { CommandDescription } from "./api";

export const reduce:CommandDescription = {
    name: 'reduce',
    documentation: `
    Reduces all the series in each group to an individual series using a specified reducer function.  NOTE that reducers don't reduce the points
    in an individual series, but rather all the points for a given moment for all the series included in each group.  

    The following reducer functions are supported:
    * avg - averages all the values in the series together
    * sum - sums the values together
    * product - multiplies the values together
    * diff - subtracts each subsequent series value from the first series
    * quotient - divides each subsequent series value from the first series
    * min - picks the min value
    * max - picks the max value
    
    NOTE that for \`diff\` and \`quotient\`, the "first series" is currently and often difficult to control.  One method is to use a search to
    pick the first series, and a subsearch to pick all subsequent series, then flatten the results (flattening will preserve series order).
    Alternatively \`sort\` may be able to be used.
    `,
    arguments: [{
        name: 'fn',
        type: 'string',
        documentation: 'the reducer function to use.'
    }]
}
