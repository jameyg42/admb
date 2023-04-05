const fn = require('../out/mean').default;
test('called as function', () => {
    expect(fn([1,2,3])).toBe(2);
});
test('called as reducer', () => {
    expect([1,2,3].reduce(fn)).toBe(2);
});
