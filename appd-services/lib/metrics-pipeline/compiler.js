const _ = require('lodash');
const parse = require('./parser').parse;
const tmpl = require('../tmpl');

const searchCmd = require('./cmds/search');

function compileExpr(ctx, expr) {
    expr = tmpl.eval(expr, ctx.vars);
    return compileTree(ctx, parse(expr));
}
function compileTree(ctx, ast) {
    const pipeline = searchCmd.compile(ctx, ast);
    return pipeline;
}
function compile(ctx, exprOrTree) {
    if (_.isString(exprOrTree)) {
        return compileExpr(ctx, exprOrTree);
    }
    return compileTree(ctx, exprOrTree);
}

module.exports = compile;
