import { parse } from "./parser";
import { SyntaxNode } from '@lezer/common';
import * as processorDefs from './processor-defs';
import { 
    CommandNode, 
    PipelineExpressionNode, 
    SearchExpressionNode, 
    ValueTypeNode, 
    CommandExpressionNode, 
    ArgNode,
    Arguments,
    SyntaxError
} from "./syntax";
import { CommandArgument, CommandDescription } from "./processor-defs/api";

export function compile(expr: string) {
    function nodeValue(node:SyntaxNode) {
        return expr.substring(node.from, node.to);
    }

    // PipelineExpression (Lezer requires a named "top" node, but this is useless)
    //   Pipeline
    //     SearchCommandExpression[0..*]
    //     CommandExpression[0..*]
    //     SubPipeline[0..*]
    function _compilePipelineStatement(pipelineStatement:SyntaxNode):PipelineExpressionNode {
        return _compilePipeline(assertNodeIs(pipelineStatement.firstChild, "PipelineExpression"));
    }
    function _compilePipeline(pipelineExpression:SyntaxNode):PipelineExpressionNode {
        const commands = [] as CommandNode[];
        const pc = pipelineExpression.cursor();
        pc.firstChild(); // commands
        do {
            switch (pc.node.name) {
                case "SearchCommandExpression":
                    commands.push(_compileSearch(pc.node));
                    break;
                case "CommandExpression":
                    commands.push(_compileCommand(pc.node));
                    break;
                case "PipelineExpression":
                    commands.push(_compilePipeline(pc.node));
                    break;
            }
        } while (pc.nextSibling());
        return new PipelineExpressionNode(commands, pipelineExpression);
    }
    // SearchCommandExpression[0..*]
    //   Application
    //   Path
    //     PathSegment[1..*]
    //   ValueType[0..*]
    //     Type
    //     Baseline?
    function _compileSearch(searchExpression:SyntaxNode):SearchExpressionNode {
        const c = searchExpression.cursor();
        c.firstChild();
        const app = nodeValue(assertNodeIs(c.node, 'Application'));
        c.nextSibling();
        assertNodeIs(c.node, 'Path');
        c.firstChild();
        const pathSegments = [] as string[];
        do {
            pathSegments.push(nodeValue(assertNodeIs(c.node, 'PathSegment')));
        } while (c.nextSibling());
        c.parent();
        const valueTypes = [] as ValueTypeNode[];
        while (c.nextSibling()) {
            assertNodeIs(c.node, 'ValueType');
            c.firstChild();
            const type = nodeValue(assertNodeIs(c.node, 'Type'));
            let baseline = undefined;
            if (c.nextSibling()) {
                baseline = nodeValue(assertNodeIs(c.node, 'Baseline'));
            }
            valueTypes.push(new ValueTypeNode(type, baseline, c.node));
            c.parent();
        }
        return new SearchExpressionNode(app, pathSegments, valueTypes, searchExpression);
    }
    // CommandExpression[0..*]
    //   Command
    //   Arg[0..*]
    //     Name?
    //     Value
    function _compileCommand(commandExpression:SyntaxNode):CommandExpressionNode {
        const c = commandExpression.cursor();
        c.firstChild();
        const cmd = nodeValue(assertNodeIs(c.node, 'Command'));

        const processor = (processorDefs as any)[cmd];
        if (! processor) {
            throw new SyntaxError(`unknown command '${cmd}'`, commandExpression, expr)
        }

        const argNodes = [] as ArgNode[];
        for (let pos = 0; c.nextSibling(); pos++) {
            const argNode = c.node;
            assertNodeIs(argNode, 'Arg');
            c.firstChild();
            let name = undefined;
            if (c.node.name == 'Name') {
                name = nodeValue(c.node);
                c.nextSibling();
            }
            const value = nodeValue(assertNodeIs(c.node, 'Value'));
            argNodes.push(new ArgNode(pos, name, value, argNode));
            c.parent();
        }

        const args = _compileArguments(commandExpression, argNodes, processor);

        return new CommandExpressionNode(cmd, args, argNodes, commandExpression, processor);
    }

    function _compileArguments(cmdNode:SyntaxNode, argNodes:ArgNode[], processor:CommandDescription):Arguments {
        // arguments can either be called by name or by position, or combinations of the two
        // the expectation around how positioned parameters are handled when mixed with named parameters
        // will likely vary with the individual - since it's easy to implement, we're 
        const args:Arguments = {};
        const cmdArgs = processor.arguments || [];
        const cmdArgMap = cmdArgs.reduce((m, a) => {
            m[a.name] = a;
            return m;
        }, {} as any)

        // first process named args
        const namedArgs = argNodes.filter(a => a.name);
        namedArgs.forEach(arg => {
            const def = cmdArgMap[(arg.name as string)];
            if (!def) {
                throw new SyntaxError(`unknown argument '${arg.name}' for '${processor.name}'`, arg.node, expr);
            }
            if (args[def.name]) {
                throw new SyntaxError(`repeated argument '${def.name}'`, arg.node, expr);
            }
            _compileArgument(arg, def, args);
        });
        
        // then try to map unnamed args to the position of the args that weren't used as named
        const positionedArgs = argNodes.filter(a => !(a.name));
        if (positionedArgs.length > 0) {
            const positions = cmdArgs.filter(def => !args[def.name]); // only those arguments not provided by name are considered
            if (positionedArgs.length > positions.length) {
                throw new SyntaxError(`expected ${positions.length} positioned args but received ${positionedArgs.length}`, cmdNode, expr);
            }
            positionedArgs.forEach((arg, i) => {
                _compileArgument(arg, positions[i], args);
            });
        }

        // make sure all non-optional args are specified
        cmdArgs
            .filter(arg => !(arg.optional))
            .forEach(arg => {
                if (!args[arg.name]) {
                    throw new SyntaxError(`required argument '${arg.name}' not provided`, cmdNode, expr);
                }
            })

        return args;
    }
    function _compileArgument(arg:ArgNode, def:CommandArgument, args:Arguments) {
        if (def.type == 'number') {
            const n = parseFloat(arg.value);
            if (isNaN(n)) {
                throw new SyntaxError(`expected number for arg '${def.name}'`, arg.node, expr);
            }
            args[def.name] = n;
        } else if (def.type == 'boolean') {
            const isTrue = arg.value.toLowerCase() === 'true';
            const isFalse = arg.value.toLowerCase() === 'false';
            if (!(isTrue || isFalse)) {
                throw new SyntaxError(`expected boolean for arg '${def.name}'`, arg.node, expr);
            }
            args[def.name] == isTrue;
        } else {
            args[def.name] = arg.value;
        }
    }

    const parseTree = parse(expr, true);
    const syntaxTree = _compilePipelineStatement(assertNodeIs(parseTree.topNode, 'PipelineScript'));
    return syntaxTree;
}


// strict parsing should ensure the parseTree has a known for, but the
// Tree API still allows things that WON'T be null to be null.  So 
// hack on an additional syntax check while testing/coercing null
function assertNodeIs(n:SyntaxNode|null|undefined, name:string):SyntaxNode {
    if (n && n.name == name) {
        return n;
    }
    throw new Error(`Invalid pipeline syntax - expected ${name}, received ${n?.name}`);
}
