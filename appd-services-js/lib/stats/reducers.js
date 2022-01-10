
////
// if reduce isn't passed an initial value, it'll use the first array element
// as the initial value and start iterating at index==1.  In most cases this is
// fine, but it means we can't use the reducer function to transform the first
// element!  
const reduceFrom = (s, fn) => (a,c,i,f) => i == 1 ? fn(fn(s,a,0,f),c,i,f) : fn(a,c,i,f);
const debug = (fn) => (a,c,i,f) => {
    console.log(`[${i}] : ${c} => ${a}`);
    return fn(a,c,i,f);
}
function safe(c) {
    return isNaN(c) ? 0 : c || 0;
}

module.exports = {
    sum: (a,c) => a+safe(c),
    product: (a,c) => a*safe(c),
    diff: (a,c) => a-safe(c),
    quotient: (a,c) => a/(safe(c) == 0 ? 1 : safe(c)),
    avg: reduceFrom(0, (a,c,i,f) => a + (parseFloat(safe(c)) / f.length)),
    min: (a,c) => Math.min(a,safe(c)),
    max: (a,c) => Math.max(a,safe(c)),
}
