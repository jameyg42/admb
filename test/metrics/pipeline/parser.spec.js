const parse = require('../../../lib/metrics/pipeline/parser');

console.log(parse('1Overall*|Call*'));
console.log(parse('search 2Overall*|Call*'));
console.log(parse('    search 3Overall*|Call*'));

console.log(parse('4Overall*|Call* |> reduce fn=sum'));
console.log(parse('5Overall*|Call* |> reduce fn=sum |> reduce'));

try {
    console.log(parse('6Overall*|Call* |> xduce key=v'));
} catch (e) { console.log(e);}

console.log(parse('7Overall*|Call* \n|> reduce fn=sum \n|> reduce fn=sum'));
