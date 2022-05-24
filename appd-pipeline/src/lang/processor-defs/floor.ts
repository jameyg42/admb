import { CommandDescription } from "./api";

export const floor:CommandDescription = {
    name: 'floor',
    documentation: 'Sets the floor for the metrics value.  Any value less than the specified floor value is set to the floor value.',
    arguments: [{
        name: 'value',
        type: 'number',
        documentation: 'the minimum value'
    }]
};
