Object.fromEntries = Object.fromEntries || ((entries:any) => {
    return [...entries].reduce((obj, [key, val]) => {
        obj[key] = val;
        return obj;
      }, {})
});
Object.entries = Object.entries || ((o:any) => {
    const entries = [];
    for (let k in o) {
        entries.push([k,o]);
    }
    return entries;
});
