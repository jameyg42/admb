import { CommandDescription } from "./api";

export const range:CommandDescription = {
  name: 'range',
  documentation: `
  Shifts the range used for searches by the given offset.  The range is shifted
  at the moment it appears in the pipeline and affects all searches in the
  current pipline or any subpipeline created from the current - it does not
  affect the 'parent' pipeline, however.

  Durations are expressed in a human readable form as defined by https://github.com/jkroso/parse-duration.  
  Positive durations shift ahead from the current range; negative behind. 
  The shift is always relative to the current range.
  `,
  arguments:[{
    name: 'shift',
    type: 'string',
    documentation: 'the amount to shift by, or the keyword \`reset\` to reset to the global range'
  }]
};
