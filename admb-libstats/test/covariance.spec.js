const covariance = require('../out/covariance').default;
const pearson = require('../out/covariance').pearson;

const x = [5, 12, 18, 23, 45];
const y = [2, 8, 18, 20, 28];

test('covariance', () => {
    expect(covariance(x,y)).toBeCloseTo(116.88);
});
test('pearson corelation', () => {
    expect(pearson(x, y)).toBeCloseTo(0.94);
})
