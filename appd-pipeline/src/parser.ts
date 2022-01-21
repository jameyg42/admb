export const parser = require('../out/_parser').parser;
export const parse = (expr:string) => {
    return parser.parse(expr);
}
