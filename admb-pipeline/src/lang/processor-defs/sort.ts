import { CommandDescription } from "./api";

export const sort:CommandDescription = {
    name: 'sort',
    documentation: 'Sorts the series in each group.',
    arguments: [{
        name: 'by',
        type: 'string',
        optional: true,
        documentation: `
the sorting operation, defaulting to "name" if not specified.  Operations may optionally take one or more arguments, provided
in the form \`command[arguments]\` (i.e. wrapped in square brackets).  
The following operations are currently supported:
* avg - the average of all the points in each series - no arguments
* name - the metric full name or portion of the full name extracted using the caputure groups of a regular expression provided as
         an argument (i.e. \`by=name[(SEA|NYC)])\`)  
* segment - the path segment specified by the index argument (i.e. \`by=segment[7]\`)
`
    },{
        name: 'dir',
        type: 'string',
        documentation: 'the sort direction, defaulting to asc(ending) for name and segment operators, and desc(ending) for the avg operator',
        optional: true
    }]
}
