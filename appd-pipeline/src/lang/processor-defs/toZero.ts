import { CommandDescription } from "./api";

export const toZero:CommandDescription = {
    name: 'toZero',
    documentation: 'Offsets each value in a series by the minimum value in the series, "flooring" the minimum value in the series at zero.',
    arguments: []
}
