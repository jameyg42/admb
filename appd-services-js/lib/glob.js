function toRex(str) {
    return new RegExp('^'+
        str
        .replace(/[*]/g, '.*')
        .replace(/[?]/g, '.')
        .replace(/{([^}]+)}/, (m,p1) => `(${p1.replace(/\s*,\s*/g,'|')})`)
        +'$'
    ) 
}
function isGlob(str) {
    return /[*?]|{[^}]+}|\[[^*?]+\]/.test(str);
}
function matches(pattern, text) {
    if (isGlob(pattern)) {
        const rex = toRex(pattern);
        const r = rex.test(text);
        return toRex(pattern).test(text);
    }
    return pattern === text;
}

module.exports = {
    toRex: toRex,
    isGlob: isGlob,
    matches: matches
}
