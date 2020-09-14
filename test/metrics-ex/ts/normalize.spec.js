const normalize = require('../../../lib/metrics-ex/normalize');


const n1 = normalize( require('./mocks/tc1_normal'));
//console.log(n1);

const n2 = normalize(require('./mocks/tc2_nodata'));
//console.log(n2);

const n3 = normalize(require('./mocks/tc3_partial'));
console.log(n3);
