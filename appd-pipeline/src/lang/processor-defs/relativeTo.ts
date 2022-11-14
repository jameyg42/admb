import { CommandDescription } from "./api";

export const relativeTo:CommandDescription = {
    name: 'relativeTo',
    documentation: `
For each current series, perform a new search relative to the path of that series.  Paths are 
always relative to the metric's parent.  (Grand)Parent paths can be selected using the parent
selector \`../\`.  NOTE however there is no root-selector - a path such as \`/Calls*\` is 
still relative to the metric's parent (so \`Calls*\`, \`/Calls*\`, and \`./Calls*\` are equalivalent).
`,
    arguments: [{
        name: 'path',
        type: 'string',
        documentation: 'a semi-colon (;) delimited list of paths'
    },{
        name: 'mode',
        type: 'string',
        optional: true,
        documentation: 'how results are merged in.  One of merge (default) or replace.'
    }]
}
