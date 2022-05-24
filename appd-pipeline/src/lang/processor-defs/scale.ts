import { CommandDescription } from "./api";

export const scale:CommandDescription = {
    name: 'scale',
    documentation: 'Scales (multiplies) each value in each series by a specified factor.',
    arguments: [{
        name: 'factor',
        type: 'number',
        documentation: 'the numeric factor to scale by'
    }]
}
