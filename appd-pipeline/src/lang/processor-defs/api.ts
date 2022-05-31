import { SyntaxNode } from "@lezer/common";
import { CommandExpressionNode } from "../syntax";

export interface CommandDescription {
    name:string;
    documentation?: string;
    arguments?: CommandArgument[];
    validator?: CommandValidator;
}
export interface CommandArgument {
    name:string;
    type:('string'|'number'|'boolean'|'any'|undefined);
    documentation?: string;
    optional?: boolean;
    options?: string[];
}
export type CommandValidator = (node:CommandExpressionNode) => void;