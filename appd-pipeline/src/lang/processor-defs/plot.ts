import { CommandDescription } from "./api";

export const plot:CommandDescription = {
    name: 'plot',
    documentation: 'Sets metadata that is used by the WebUI\'s plot component.',
    arguments: [{
        name: 'type',
        type: 'string',
        documentation: 'the type of plot - one of line|bar|stacked-bar.  defaults to `line`',
        optional: true
    }, {
        name: 'yaxis',
        type: 'number',
        documentation: 'the yaxis to plot the series on - defaults to 1',
        optional: true
    }],
    varargs: true
};
