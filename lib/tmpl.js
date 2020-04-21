const _ = require('lodash');

////
// a super-trivial "template" engine that does
// string interpolation.

const interpolate = /\#(?:([a-zA-Z0-9_]+)|(?:\{([\s\S]+?)\}))/g;

function defaultValueFormatter(v) {
    return  _.isString(v) ? v 
          : _.isArray(v) ? v.join(',') 
          : v;
}

function getProp (path, ctx) {
    let v = ctx;
    try {
        path.split('.').forEach(p => {
            v = v[p];
            if (!v) throw ""; 
        });
        return v;
    } catch(e) {
    }
}

function eval(tmpl, ctx, vf) {
    vf = vf || defaultValueFormatter;
    const r = tmpl.replace(interpolate, (m, s1, s2) => {
        let v = vf(getProp(s1 || s2, ctx));
        return v ? v : m;
    });
    return r;
}

module.exports = {
    eval: eval,
    with: (model, vf) => ({eval: (tmpl) => eval(tmpl, model, vf)}),
    getProp, getProp
};