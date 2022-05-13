import { SyntaxNode } from "@lezer/common";
import { CommandDescription } from "./processor-defs/api";

export interface CommandNode {
    node: SyntaxNode;
    type: string;
}
export interface ProcessingNode extends CommandNode {
    command: CommandDescription;
}
export class PipelineExpressionNode implements CommandNode {
    readonly type = 'Pipeline';
    constructor(public commands:(CommandNode)[], public node:SyntaxNode){};
}
export class SearchExpressionNode implements ProcessingNode {
    readonly type = 'Search';
    constructor(public app:string, public path:string[], public values:ValueTypeNode[], public node:SyntaxNode, public command = {name:'search'}) {}
}
export class ValueTypeNode {
    constructor(public type:string, public baseline:string|undefined, public node:SyntaxNode) {}
}

export class CommandExpressionNode implements ProcessingNode {
    readonly type = 'Command';
    constructor(public name:string, public args:Arguments, public argNodes: ArgNode[], public node:SyntaxNode, public command:CommandDescription) {}
}
export class ArgNode {
    constructor(public position: number, public name:string|undefined, public value: string, public node:SyntaxNode) {
        // the grammar does not currently strip quotes from string values, so do that here (FIXME more robust matching)
        if (/^\".*\"$/.test(value)) {
            value = value.substring(1, value.length - 1);
        }
    }
}
export type Arguments = ({[key:string]:string|number|boolean});

export class SyntaxError extends Error {
    constructor(message:string, node:SyntaxNode, expr:string) {
        const snip = expr.substring(Math.max(0, node.from - 3), Math.min(expr.length,node.to+8));
        super(`error near '${snip}[${node.from}:${node.to}] : ${message}`)
    }
}
