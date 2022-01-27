const _ = require('lodash');

////
// a super-trivial "template" engine that does
// string interpolation.

const interpolate = /\%(?:([a-zA-Z0-9_\[\]]+)|(?:\{([\s\S]+?)\}))/g;

function defaultValueFormatter(v) {
    return  _.isString(v) ? v 
          : _.isArray(v) ? v.join(',') 
          : v;
}


function eval(tmpl, ctx, vf) {
    vf = vf || defaultValueFormatter;
    const r = tmpl.replace(interpolate, (m, s1, s2) => {
        let v = vf(_.get(ctx, s1 || s2));
        return v ? v : m;
    });
    return r;
}

module.exports = {
    eval: eval,
    with: (model, vf) => ({eval: (tmpl) => eval(tmpl, model, vf)}),
};