const fn = require('../out/product').default;
test('called as function', () => {
    expect(fn([2,3,4])).toBe(24);
});
test('called as reducer', () => {
    expect([2,3,4].reduce(fn)).toBe(24);
});
