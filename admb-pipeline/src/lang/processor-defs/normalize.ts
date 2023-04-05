import { CommandDescription } from "./api";

export const normalize:CommandDescription = {
    name: 'normalize',
    documentation: `
Applies min/max normalizion for each value in the series.  Normalizing is useful when comparing multiple series that are scaled
differently (i.e. calls per minute vs. response time) to show how a change in one value impacts a change in another value since
all values are automatically scaled to a value between 0 and 1.
`,
    arguments: []
};
