import { CommandDescription } from "./api";

export const shift:CommandDescription = {
    name: 'shift',
    documentation: `
    Shifts the time of each data point by a given value.  Durations are expressed in a human readable form
    as defined by https://github.com/jkroso/parse-duration.  Positive durations shift to the future; negative
    to the past.  NOTE that shifting does not change the range of data fetched from AppDynamics - shifting
    instead just adds/subtracts a value from the timestamps of the series leaving a gap at the start/end of 
    the series compared to the range the data was fetch with depending on the direction data is shifted.  
    `,
    arguments: [{
        name: 'duration',
        type: 'string',
        documentation: 'the duration to shift'
    }]
}
