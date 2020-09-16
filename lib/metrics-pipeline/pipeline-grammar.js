// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "dqstring$ebnf$1", "symbols": []},
    {"name": "dqstring$ebnf$1", "symbols": ["dqstring$ebnf$1", "dstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dqstring", "symbols": [{"literal":"\""}, "dqstring$ebnf$1", {"literal":"\""}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "sqstring$ebnf$1", "symbols": []},
    {"name": "sqstring$ebnf$1", "symbols": ["sqstring$ebnf$1", "sstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "sqstring", "symbols": [{"literal":"'"}, "sqstring$ebnf$1", {"literal":"'"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "btstring$ebnf$1", "symbols": []},
    {"name": "btstring$ebnf$1", "symbols": ["btstring$ebnf$1", /[^`]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "btstring", "symbols": [{"literal":"`"}, "btstring$ebnf$1", {"literal":"`"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "dstrchar", "symbols": [/[^\\"\n]/], "postprocess": id},
    {"name": "dstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": 
        function(d) {
            return JSON.parse("\""+d.join("")+"\"");
        }
        },
    {"name": "sstrchar", "symbols": [/[^\\'\n]/], "postprocess": id},
    {"name": "sstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": function(d) { return JSON.parse("\""+d.join("")+"\""); }},
    {"name": "sstrchar$string$1", "symbols": [{"literal":"\\"}, {"literal":"'"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sstrchar", "symbols": ["sstrchar$string$1"], "postprocess": function(d) {return "'"; }},
    {"name": "strescape", "symbols": [/["\\/bfnrt]/], "postprocess": id},
    {"name": "strescape", "symbols": [{"literal":"u"}, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/], "postprocess": 
        function(d) {
            return d.join("");
        }
        },
    {"name": "main", "symbols": ["_", "s_expr", "_"], "postprocess": ([,expr]) => expr},
    {"name": "s_expr", "symbols": ["search"], "postprocess": id},
    {"name": "search", "symbols": ["paths"], "postprocess": ([paths]) => ({op:'search', paths: paths, pipes:[]})},
    {"name": "search", "symbols": ["paths", "_", "pipeline"], "postprocess": ([paths,,pipes]) => ({op:'search', paths: paths, pipes:pipes})},
    {"name": "paths", "symbols": ["path"], "postprocess": id},
    {"name": "paths", "symbols": ["path", "_", {"literal":";"}, "_", "paths"], "postprocess": ([path,,,,paths]) => path.concat(paths)},
    {"name": "path$ebnf$1", "symbols": ["vals"], "postprocess": id},
    {"name": "path$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "path", "symbols": ["app", "app_delim", "mp", "path$ebnf$1"], "postprocess": ([app,,mp,vals])  => ({app: app, path: mp, values: vals})},
    {"name": "app$ebnf$1", "symbols": [/[^|]/]},
    {"name": "app$ebnf$1", "symbols": ["app$ebnf$1", /[^|]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "app", "symbols": [/[^\s]/, "app$ebnf$1"], "postprocess": d => d[0] + d[1].join('')},
    {"name": "mp$ebnf$1", "symbols": [/[^=;>\[\]\n]/]},
    {"name": "mp$ebnf$1", "symbols": ["mp$ebnf$1", /[^=;>\[\]\n]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "mp", "symbols": ["mp$ebnf$1", /[^\s]/], "postprocess": d => d[0].join('') +d[1]},
    {"name": "vals$ebnf$1", "symbols": [/[^\]]/]},
    {"name": "vals$ebnf$1", "symbols": ["vals$ebnf$1", /[^\]]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "vals", "symbols": [{"literal":"["}, "vals$ebnf$1", {"literal":"]"}], "postprocess": d => d[1].join('')},
    {"name": "app_delim$string$1", "symbols": [{"literal":":"}, {"literal":"|"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "app_delim", "symbols": ["app_delim$string$1"]},
    {"name": "app_delim$string$2", "symbols": [{"literal":":"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "app_delim", "symbols": ["app_delim$string$2"]},
    {"name": "pipeline", "symbols": ["pipe"], "postprocess": id},
    {"name": "pipeline", "symbols": ["pipe", "_", "pipeline"], "postprocess": ([pipe,,pipes]) => pipe.concat(pipes)},
    {"name": "pipe", "symbols": ["pipeOp", "_", "pipeCmd"], "postprocess": ([,,cmd]) => cmd},
    {"name": "pipe", "symbols": ["pipeOp", "_", "subSearch"], "postprocess": ([,,sub]) => sub},
    {"name": "subSearch", "symbols": [{"literal":"["}, "_", "s_expr", "_", {"literal":"]"}], "postprocess": ([,,sub]) => [sub]},
    {"name": "subSearch$string$1", "symbols": [{"literal":"s"}, {"literal":"u"}, {"literal":"b"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "subSearch", "symbols": ["subSearch$string$1", "_", {"literal":"("}, "_", "s_expr", "_", {"literal":")"}], "postprocess": ([,,,,sub]) => [sub]},
    {"name": "pipeCmd", "symbols": ["cmd"], "postprocess": ([cmd]) => [({op: cmd, args: []})]},
    {"name": "pipeCmd", "symbols": ["cmd", "__", "args"], "postprocess": ([cmd,,args]) => [({op: cmd, args: args})]},
    {"name": "cmd", "symbols": ["identifier"], "postprocess": id},
    {"name": "args", "symbols": ["arg"], "postprocess": id},
    {"name": "args", "symbols": ["arg", "__", "args"], "postprocess": ([arg,,args]) => arg.concat(args)},
    {"name": "arg", "symbols": ["namedArg"], "postprocess": ([arg]) => [arg]},
    {"name": "arg", "symbols": ["positionalArg"], "postprocess": ([arg]) => [arg]},
    {"name": "positionalArg", "symbols": ["value"], "postprocess": ([value]) => ({name:null,value:value})},
    {"name": "namedArg", "symbols": ["identifier", "_", {"literal":"="}, "_", "value"], "postprocess": ([name,,,,value]) => ({name:name,value:value})},
    {"name": "string", "symbols": ["dqstring"], "postprocess": id},
    {"name": "string", "symbols": ["sqstring"], "postprocess": id},
    {"name": "pipeOp$string$1", "symbols": [{"literal":"|"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "pipeOp", "symbols": ["pipeOp$string$1"]},
    {"name": "pipeOp$string$2", "symbols": [{"literal":"/"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "pipeOp", "symbols": ["pipeOp$string$2"]},
    {"name": "pipeOp$string$3", "symbols": [{"literal":">"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "pipeOp", "symbols": ["pipeOp$string$3"], "postprocess": id},
    {"name": "value", "symbols": ["string"], "postprocess": id},
    {"name": "value$ebnf$1", "symbols": [/[^\s">=]/]},
    {"name": "value$ebnf$1", "symbols": ["value$ebnf$1", /[^\s">=]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "value", "symbols": ["value$ebnf$1"], "postprocess": d => d[0].join('')},
    {"name": "identifier$ebnf$1", "symbols": [/[\w]/]},
    {"name": "identifier$ebnf$1", "symbols": ["identifier$ebnf$1", /[\w]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "identifier", "symbols": ["identifier$ebnf$1"], "postprocess": d => d[0].join('')},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": d => null},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": d => null},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
