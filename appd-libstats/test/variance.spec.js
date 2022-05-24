const variance = require('../out/variance').default;

test('variance', () => {
    const x = [4, 9, 12, 19, 24, 47, 55, 56];
    expect(variance(x)).toBeCloseTo(395.438);
});
