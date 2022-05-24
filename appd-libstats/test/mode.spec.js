const fn = require('../out/mode').default;
test('single element', () => {
    expect(fn([5])).toBe(5);
});
test('single maximum count', () => {
    expect(fn([3,3,3,2,2,2,2,1])).toBe(2);
})
test('multiple with same count', () => {
    expect([-1,2,2,5,5,44].reduce(fn)).toBe(2);
});
