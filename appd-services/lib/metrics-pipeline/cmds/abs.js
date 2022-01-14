
const base = require('./_base');
const abs = require('@metlife/appd-libmetrics/out/ops/abs').default;
module.exports = {
    compile: base.compileForSeries((ctx,args) => abs),
    params: []
}
