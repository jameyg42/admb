import { SyntaxNode } from "@lezer/common";
import { CommandExpressionNode } from "../syntax";

export interface CommandDescription {
    name:string;
    documentation?: string;
    arguments?: CommandArgument[];
    // short-term hack to support variable arguments.  A more robust 
    // "plugable" verification mechanism should be developed
    varargs?: boolean;
}
export interface CommandArgument {
    name:string;
    type:('string'|'number'|'boolean'|'any'|undefined);
    documentation?: string;
    optional?: boolean;
    options?: string[];
}
