import { CommandDescription } from "./api";

export const bin:CommandDescription = {
    name: 'bin',
    documentation: 'combines continuous metric series values into discrete sets of a given time span',
    arguments: [{
      name: 'span',
      type: 'string',
      documentation: 'the `width` of each bin as a time interval',
      optional: false
   },{
      name: 'fn',
      type: 'string',
      documentation: 'the function to use when combining values into bins.  Defaults to `sum`',
      optional: true
  }]
};
