try {
    parser = require('../../out/pipeline.grammar').parser;
} catch (e) {
    console.error(e);
}


function dump_to_array(expr, treeOrParser) {
    const tree = treeOrParser && treeOrParser.id ? treeOrParser : (treeOrParser || parser).parse(expr);
    const nodes = [];
    let lvl = 0;
    tree.iterate({
        enter: (node) => {
            lvl++;
            const o = {};
            nodes.push(o);
            o[new Array(lvl).fill(' ').join('')+node.name] = `${expr.substring(node.from, node.to)} [${node.from}:${node.to}]` ;
            return true;
        },
        leave: () => {
            lvl--;
        }
    });
    return nodes;
}
function pipeline(expr) {
    let nodes = [];
    nodes.push({Pipeline:expr});
    const builder = {
        search: (app, path, type, baseline) => {
            const delim = path.substring(0,1);
            const paths = path.split(delim);
            const baselineExpr = baseline ? `@${baseline}` : '';
            const typeExpr = type ? `[${type}${baselineExpr}]` : '';
            const search = `${app}:${path}${typeExpr}`;
            nodes = nodes.concat([
                {SearchCommandExpression: search},
                {Application:app},
                {Path:path}
            ])
            .concat(paths
                .filter(p=>p != '')
                .map(p => ({PathSegment: p})
            ));
            if (type) {
                nodes.push({ValueType: type});
            }
            if (baseline) {
                nodes.push({Baseline: baseline});
            }
            return builder;
        },
        command:  (cmd, args) => {
            nodes.push({Command: cmd});
            args.map(arg => {
                if (typeof arg === 'string') {
                    return [
                        {Arg: arg},
                        {Value: arg}
                    ];
                } else {
                    return Object.entries(arg).map(([k,v]) => ([
                        {Arg: `${k}=${v}`},
                        {Name: k},
                        {Value: v}
                    ]));
                }
            }).forEach(a => {
                nodes = nodes.concat(...a);
            });
            return builder;
        },
        subPipeline: (nodes) => {
            nodes.concat(nodes);
            return builder;
        },
        nodes: () => nodes
    }
    return builder;
}

module.exports = {
    dump_to_array,
    pipeline
};
