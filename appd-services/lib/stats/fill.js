function fill(d) {
    const nonNulls = d.filter(v => v != null);
    if (nonNulls.length == d.length || nonNulls.length < 2) {
        return d;
    }

    const c = d.slice();
    // first, fill in any leading/trailing gaps - we should probably extrapolate these
    // but for now we'll just "interpolate" using the first/last non-null value
    for (let i = 0; c[i] == null; i++) {
        c[i]  = nonNulls[0];
    }
    for (let i = c.length-1; c[i] == null; i--) {
        c[i] = nonNulls[nonNulls.length-1];
    }

    // now fill in the middle gaps by simple linear interpolation
    for (let i = 0; i < c.length; i++) {
        if (c[i] == null) {
            let j = i;
            for (;c[j] == null; j++);
            const gap = j - i;
            const s = i > 0 ? c[i-1] : c[j];
            const e = c[j] || s;
            const step =  (e - s) / (gap + 1);
            for (let v = 1; i < j; v++, i++) {
                c[i] = s + (step * v);
            }
        }
    }   
    return c; 
}


module.exports = fill;