const clone = require('../out/clone').default;
const samples = require('./samples').t1_d4h_p1m;

test('clone works', () => {
    const c = clone(samples.cpm);
    expect(c).toStrictEqual(samples.cpm); // should be equal (deep)
    expect(c).not.toBe(samples.cpm);      // but not be the same instance
});
