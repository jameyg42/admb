const client = require('../it-client');
const pipeline = require('../../lib/metrics-pipeline')(client);
const stats = require('../../lib/stats/reducers');
const _ = require('lodash');

const searches = [
    // '*IBSE_QA:|Overall*|Average Res*',
    // '*IBSE_QA:|Overall*|Average Res*[max]',
    // '*IBSE_QA:|Overall*|{Calls*,Average Re*}',
    // '*IBSE_QA:|Overall*|Average Res*[value, max] |> [ 8911*QA:|Overall*|Calls* ]',
    // '*IBSE_QA:|Overall*|Average Res*[baseline@WEEKLY]',
    // '*IBSE_QA:|Overall*|{Calls*,Average Re*} |> groupBy 2',
    // '*IBSE_QA:|Overall*|Calls* |> label "%s[2]"',
    // '*IBSE_QA:|Overall*|{Calls*,Average Res*} |> filter "name == \'Calls per Minute\'"',
    // '*IBSE_QA:|Overall*|{Calls*,Average Res*} |> sort avg',
    '*IBSE_QA:|Overall*|{Average Res*, Calls*} |> reduce avg'
]

function debug(tss) {
    return _.flattenDeep(tss)
        .map(ts => ({
            name: ts.name,
            size: ts.data.length,
            starts: new Date(ts.data[0].start),
            ends: new Date(ts.data[ts.data.length - 1].start),
            avg: ts.data.map(d => d.value).reduce(stats.avg)
        }))
        .map(s => `${s.name}[${s.size}] = ${s.avg} (${s.starts} -> ${s.ends})`)
}
searches.forEach(async (s) => {
    const r = await pipeline.exec(s);
    console.log(s, debug(r));
});


// const e2 = 'Overall*|{Calls*,Errors*};Application Infrastructure Performance|*|Hardware Resources|CPU|%Busy';
// pipeline.exec(e2, itApp)
// .then(console.log);


// const e3 = 'Overall*|{Calls*,Errors*} |> reduce fn=sum';
// pipeline.exec(e3, itApp)
// .then(console.log);

// const e4 = 'Overall*|{Calls*,Average Re*} |> sub (Overall*|Errors* |> scale 100)';
// pipeline.exec(e4, itApp)
// .then(x => console.log('done', x));

// const e5 = 'app=0000* Over*|*|Average Res* |> scale .001';
// pipeline.exec(e5, itApp)
// .then(x => console.log('done', x));
