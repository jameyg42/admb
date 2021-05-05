const range = require('../lib/range');

const last60 = range.beforeNow(60);
const last60Fixed = range.fix(last60);

console.log(last60, last60Fixed);