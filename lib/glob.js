function toRex(str) {
    return new RegExp('^'+
        str
        .replace(/[*]/g, '.*')
        .replace(/[?]/g, '.')
        .replace(/{([^}]+)}/, (m,p1) => `(${p1.replace(',','|')})`)
    ) 
}
function isGlob(str) {
    return /[*?]|{[^}]+}|\[[^*?]+\]/.test(str);
}
function matches(pattern, text) {
    if (isGlob(pattern)) {
        return toRex(pattern).test(text);
    }
    return pattern === text;
}

module.exports = {
    toRex: toRex,
    isGlob: isGlob,
    matches: matches
}