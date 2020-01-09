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


// const e3 = 'Overall*|{Calls*,Errors*} |> reduce fn=sum';
// pipeline.exec(e3, itApp)
// .then(console.log);

// const e4 = 'Overall*|{Calls*,Average Re*} |> sub (Overall*|Errors* |> scale 100)';
// pipeline.exec(e4, itApp)
// .then(x => console.log('done', x));

const e5 = 'app=0000 Over*|*|Average Res* |> scale .001';
pipeline.exec(e5, itApp)
.then(x => console.log('done', x));
