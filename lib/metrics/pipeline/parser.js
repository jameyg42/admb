const nearley = require('nearley');
const Parser = nearley.Parser;
const Grammar = nearley.Grammar;
const grammar = require('./pipeline-grammar');

function parse(expr) {
    try {
        const parser = new Parser(Grammar.fromCompiled(grammar));
        parser.feed(expr);
        if (parser.results.length == 0) {
            const err = new Error('Unexpected end of input');
            err.offset = expr.length;
            err.token = '[eof]';
            throw err;
        } else if (parser.results.length > 1) {
            const err = new Error('BUGHIT: unexpected ambiguous grammar');
            err.offset = expr.length;
            err.token = '';
            err.results = parser.results;
            throw err;
        }
        return parser.results[0];
    } catch (e) {
        throw e;
    }
}

module.exports = {
    parse: parse,
    streaming: () => new Parser(Grammar.fromCompiled(grammar))

}