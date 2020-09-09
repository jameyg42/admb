const client = require('../it-client');

const pipeline = require('../../lib/metrics-pipeline')(client);

const tc1 = "app=8167* Overall*|edpm*|Individual*|*RISC*|Calls*;Overall*|edpm*|Indiv*|*SISC*|Calls* |> reduce fn=avg |> flatten |> reduce fn=diff ";
pipeline.exec(tc1)
.then(x => console.log('done', x));
