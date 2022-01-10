const corr = require('../../lib/stats/corr');

test('covariance', () => {
    const r = corr.covariance([1,2,3,4], [5,6,7,8]);
    expect(r).toBeCloseTo(1.25);
});

describe('pearson', () => {
    test('should be 1', () => {
        const r = corr.pearson([1,2,3,4], [5,6,7,8]);
        expect(r).toBeCloseTo(1);
    });
})
