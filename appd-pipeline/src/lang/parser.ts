import { parser } from './pipeline.grammar';
import { LRParser } from '@lezer/lr';

export const parse = (expr:string, strict = false) => {
    return (parser as LRParser).configure({strict}).parse(expr);
}
