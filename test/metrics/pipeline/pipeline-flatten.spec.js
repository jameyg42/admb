const client = require('@metlife/appd-client-js').open({
    url: 'https://appd.metlife.com',
    uid : 'AQ813306',
    pwd : 'gad8babU'
})

const pipeline = require('../../../lib/metrics/pipeline/pipeline')(client);

const itApp = {
    id: 135,
    name: '0000-SANDBOX_HEALTHRULE_TEST'
}

const tc1 = "Overall*|edpm*|Individual*|*RISC*|Calls*;Overall*|edpm*|Indiv*|*SISC*|Calls* |> reduce fn=avg |> flatten |> reduce fn=diff ";
pipeline.exec(tc1, itApp)
.then(x => console.log('done', x));
