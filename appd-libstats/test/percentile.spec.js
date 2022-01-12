const fn = require('../out/percentile').default;
test('90th among 10', () => {
    expect(fn(.9)([1,10,2,9,3,8,4,7,5,6])).toBe(9);
});
test('called as reducer', () => {
    expect([1,10,2,9,3,8,4,7,5,6].reduce(fn(.9))).toBe(9);
});
