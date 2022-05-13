import { CommandDescription } from "./api";

export const reduce:CommandDescription = {
    name: 'reduce',
    arguments: [{
        name: 'fn',
        type: 'string'
    }]
}
