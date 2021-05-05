const fill = require('../../lib/stats/fill');

const t1 = [null, 12, 13, null, 15, 16, null, null, 19, null, null, null, 20, null, null];
const r1 = fill(t1);
console.log(r1);