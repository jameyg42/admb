const fn = require('../out/quartile').default;
const iqr = require('../out/quartile').iqr;

const ex = [
    12,     // q1  h1
    22,     // q1  h1
23,         // q12 h1 -
    24,     // q2  h1
25,         // q2  h1 -
29,         // q3  h2 -
    30,     // q3  h2 
44,         // q34 h2
    45,     // q4  h2 -
    58      // q4  h2
];

test('quartiles - evenly divided set', () => {
    const [q1,q2,q3] = fn(ex);
    expect(q1).toBe(23);
    expect(q2).toBe(27);
    expect(q3).toBe(44);
});
test('iqr - evenly divided', () => {
    expect(iqr(ex)).toBe(21);
});
