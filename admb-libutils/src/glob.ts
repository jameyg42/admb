export function toRex(str:string) {
    return new RegExp('^'+
        str
        .replace(/[*]/g, '.*')
        .replace(/[?]/g, '.')
        .replace(/{([^}]+)}/g, (m,p1) => `(${p1.replace(/\s*,\s*/g,'|')})`)
        +'$'
    )
}
export function isGlob(str:string) {
    return /[*?]|{[^}]+}|\[[^*?]+\]/.test(str);
}
export function matches(pattern:string, text:string) {
    if (isGlob(pattern)) {
        const rex = toRex(pattern);
        const r = rex.test(text);
        return toRex(pattern).test(text);
    }
    return pattern === text;
}
