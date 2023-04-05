import { CommandDescription } from "./api";

export const fill:CommandDescription = {
    name: 'fill',
    documentation: `
Fill in gaps of missing data, currently using simple linear interpolation between gap edges.  NOTE that AppDynamics doesn't
always differentiate between a gap and a zero, so all gaps are currently represented as zeros.  This could skew aggregator
functions (see \`filter\` and \`sort\`).  Zero vs. gap handling will be improved in the future, but for now you may need to
\`fill\` in the gaps for sorting/filtering to work correctly.
`,
    arguments: []
};
