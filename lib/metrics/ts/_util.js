const zip = require('lodash').zip;
const _range = require('../../range');

const metricValues = ['value', 'baseline', 'min', 'max', 'stddev'];

function zipValues(...data) {
    return zip(...data).reduce((z,d) => {
        z.push(d.reduce((a,v,i) => {
            if (i == 0) {
                a.start = v.start;
                metricValues.forEach(mv => a[mv] = [v[mv]]);
            } else {
                metricValues.forEach(mv => a[mv].push(v[mv]));
            }
            return a;
        },{}))
        return z;
    },[]);
}
function clone(o) {
    return Object.assign({}, o);
}



module.exports = {
    values: metricValues,
    zipValues: zipValues,
    clone: clone,
    merge: (o, m) => Object.assign(clone(o), m)
}
