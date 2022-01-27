import { get, isString, isArray } from 'lodash';

////
// a super-trivial "template" engine that does string interpolation.
// general format %path | %{path}
// see lodash get() for more info on path (path => a[0].b.c)

const interpolate = /\%(?:([a-zA-Z0-9_\[\]]+)|(?:\{([\s\S]+?)\}))/g;

export type ValueFormatter = (v:any) => string;
const defaultValueFormatter:ValueFormatter = (v:any) => {
    return  isString(v) ? v 
          : isArray(v) ? v.join(',') 
          : v;
};

export function evaluate(tmpl:string, ctx:any, vf = defaultValueFormatter):string {
    const r = tmpl.replace(interpolate, (m, s1, s2) => {
        let v = vf(get(ctx, s1 || s2));
        return v ? v : m;
    });
    return r;
}
export const using = (model:any, vf?:ValueFormatter) => ({
    evaluate: (tmpl:string) => evaluate(tmpl, model, vf)
});
