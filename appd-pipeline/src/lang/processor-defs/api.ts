
export interface CommandDescription {
    name:string;
    documentation?: string;
    arguments?: CommandArgument[];
}
export interface CommandArgument {
    name:string;
    type:('string'|'number'|'boolean'|undefined);
    documentation?: string;
    optional?: boolean;
    options?: string[];
}
