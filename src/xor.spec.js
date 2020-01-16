const xor = require('./xor');

const clear = '$p3Lunk#r_metlife1';
const cypher = xor(clear);

console.log(clear, cypher, xor(cypher));
