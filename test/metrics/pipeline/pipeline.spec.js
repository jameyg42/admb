const client = require('../../it-client');
const pipeline = require('../../../lib/metrics/pipeline/pipeline')(client);


const itApp = {
    id: 577,
    name: '0000-SANDBOX_HEALTHRULE_TEST'
}

// const e1 = 'Overall*|Calls*';
// pipeline.exec(e1, itApp)
// .then(console.log);



// const e2 = 'Overall*|{Calls*,Errors*};Application Infrastructure Performance|*|Hardware Resources|CPU|%Busy';
// pipeline.exec(e2, itApp)
// .then(console.log);


const e3 = 'Overall*|{Calls*,Errors*} |> reduce fn=sum';
pipeline.exec(e3, itApp)
.then(console.log);
