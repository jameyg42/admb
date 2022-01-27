Object.fromEntries = Object.fromEntries || ((entries:any) => {
    return [...entries].reduce((obj, [key, val]) => {
        obj[key] = val
        return obj
      }, {})
});
