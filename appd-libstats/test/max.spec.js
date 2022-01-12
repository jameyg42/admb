const fn = require('../out/max').default;
test('called as function', () => {
    expect(fn([12, 1, 1974])).toBe(1974);
});
test('called as reducer', () => {
    expect([12, 1, 1974].reduce(fn)).toBe(1974);
});
