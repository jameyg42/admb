import { CommandDescription } from "./api";

export const offset:CommandDescription = {
    name: 'offset',
    documentation: 'Adds a given value to each value in the series.',
    arguments: [{
        name: 'value',
        type: 'number',
        documentation: 'the offset distance added to each series value.'
    }]
};
