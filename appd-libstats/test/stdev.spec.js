const stdev = require('../out/stdev').default;

test('stdev', () => {
    const x = [4, 9, 12, 19, 24, 47, 55, 56];
    expect(stdev(x)).toBeCloseTo(19.886);
});
