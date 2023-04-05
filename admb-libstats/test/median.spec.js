const fn = require('../out/median').default;
test('odd number of elements', () => {
    expect(fn([9,0,2,1,0])).toBe(1);
});
test('even number of elements - greater than 2', () => {
    expect(fn([2,4,6,8])).toBe(5);
});
test('single element', () => {
    expect(fn([5])).toBe(5);
});
test('two elements', () => {
    expect(fn([1,3])).toBe(2);
})
test('called as reducer', () => {
    expect([1,2,3].reduce(fn)).toBe(2);
});
