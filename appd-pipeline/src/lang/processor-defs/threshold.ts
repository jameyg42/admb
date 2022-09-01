import { CommandDescription } from "./api";

export const threshold:CommandDescription = {
    name: 'threshold',
    documentation: `
Creates a new series equal in length to the largest series in the group with a given fixed value (e.g. draws a 
horizontal line).  NOTE that the series created using threshold is a true series included in the group and will
be affected by any additional tranforms conducted on the series in the group.
`,
    arguments: [{
        name: 'value',
        type: 'number',
        documentation: 'the value of the threshold line'
    }]
}
