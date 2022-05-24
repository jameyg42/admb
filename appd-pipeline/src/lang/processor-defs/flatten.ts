import { CommandDescription } from "./api";

export const flatten:CommandDescription = {
    name: 'flatten',
    documentation: `
    Flattens groups - that is, combines all the individual grouped series into a single group for the current pipeline expression.  NOTE that
    currently this is always a "deep" flatten, but only for the current pipeline expression (i.e. if used in a subsearch, only the subsearch
    results are flattened into a single group).
    `,
    arguments: []
};
