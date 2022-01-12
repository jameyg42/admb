const fn = require('../out/sum').default;
test('called as function', () => {
    expect(fn([1,2,3])).toBe(6);
});
test('called as reducer', () => {
    expect([1,2,3].reduce(fn)).toBe(6);
});
test('called with initial value', () => {
    expect([1,2,3].reduce(fn, 100)).toBe(106);
});
