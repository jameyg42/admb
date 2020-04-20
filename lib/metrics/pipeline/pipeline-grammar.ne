#test -> main {% d => d.length + ':' + JSON.stringify(d) %}
@builtin "string.ne"

main -> _ s_expr _ {% ([,expr]) => expr %}

s_expr -> 
	appArg __ search {% ([app,,search]) => {
		search.ctx = app;
		return search;
	} %}
appArg ->
	"app" _ "=" _ value {% ([name,,,,value]) => ({app:value}) %}

search ->
	paths {% ([paths]) => ({op:'search', paths: paths, pipes:[]}) %} |
	paths _ pipeline {% ([paths,,pipes]) => ({op:'search', paths: paths, pipes:pipes}) %}
paths ->
	path {% id %}|
	path _ ";" _ paths {% ([path,,,,paths]) => path.concat(paths) %}
path ->
	string |
	[^\s"] [^=;>\n]:* [^\s="] {% d => [d[0] + d[1].join('') + d[2]] %}



pipeline -> 
	pipe {% id %} |
	pipe _ pipeline {% ([pipe,,pipes]) => pipe.concat(pipes) %}
pipe ->
	pipeOp _ pipeCmd {%([,,cmd]) => cmd %} |
	pipeOp _ subSearch {% ([,,sub]) => sub %}
subSearch ->
	"[" _ s_expr _ "]" {% ([,,sub]) => [sub] %} |
	"sub" _ "(" _ s_expr _ ")" {% ([,,,,sub]) => [sub] %}

pipeCmd ->
	cmd {% ([cmd]) => [({op: cmd, args: []})] %} |
	cmd __ args {%([cmd,,args]) => [({op: cmd, args: args})] %}

cmd -> 
	identifier {% id %}
args ->
	arg {% id %} |
	arg __ args {% ([arg,,args]) => arg.concat(args) %}
arg ->
	namedArg {% ([arg]) => [arg] %} |
	positionalArg {% ([arg]) => [arg] %}

positionalArg -> 
	value {% ([value]) => ({name:null,value:value}) %}
namedArg ->
	identifier _ "=" _ value {% ([name,,,,value]) => ({name:name,value:value}) %}



string ->
	dqstring {% id %} | 
	sqstring {% id %}

pipeOp ->
	"|>" {% id %}

value -> 
	string {% id %} |
	[^\s">=]:+ {% d => d[0].join('') %}

identifier ->
	[\w]:+ {% d => d[0].join('') %}
	
_  -> wschar:* {% d => null %}
__ -> wschar:+ {% d => null %}
wschar -> 
	[ \t\n\v\f] 
