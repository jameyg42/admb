const fn = require('../out/difference').default;
test('called as function', () => {
    expect(fn([2,3,4])).toBe(-5);
});
test('called as reducer', () => {
    expect([2,3,4].reduce(fn)).toBe(-5);
});
