const client = require('../it-client');

const pipeline = require('../../lib/metrics-pipeline')(client);

// const tc1 = "2942-IBSE*:|Overall Application Performance|ems*|Calls per Minute";
// pipeline.exec(tc1)
// .then(x => console.log('done', x));

const tc2 = "8911*:|Overall*|Calls* |> [ 2942*:|Overall*|Calls*]";
pipeline.exec(tc2)
.then(x => console.log('done', x));
