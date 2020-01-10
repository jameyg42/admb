const parser = require('../../../lib/metrics/pipeline/parser');
const moment = require('moment');

const start = moment();
const iterations = 50000;
for (var i = 0; i < iterations; i++) {
    const p = parser.streaming();
    p.feed(`
    app=8911 Business Transaction Performance|Business Transactions|*|Login*|Average Res*
    |> plot yaxis=1
    |> [
        app=WMB Application Infrastructure Performance|MB|Custom Metrics|WMB|*|*|CHP*|Flow Statistics|MessageFlow|AverageElapsedTime
        |> groupBy segment=7
        |> reduce fn=avg
        |> outlier 
        |> scale .001 
        |> plot type=stacked-bar yaxis=1
    ]
    |> flatten
    `);
}

const end = moment();
console.log(`Ran for ${end.diff(start, 'seconds')}s`);
console.log(`${end.diff(start,'milliseconds') / iterations} ms per iteration`);
