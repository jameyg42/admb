import { CommandDescription } from "./api";

export const ceil:CommandDescription = {
    name:'ceil',
    documentation: 'Sets a ceiling for the metric value.  Any value exceeding the specified ceiling value is set to the ceiling value.',
    arguments: [{
        name:'value',
        documentation: 'the maximum value',
        type: 'number'
    }]
};
