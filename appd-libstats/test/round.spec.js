const round = require('../out/round').default;

test('round PI to 2 places', () => {
    expect(round(Math.PI, 2)).toBe(3.14);
});
test('round PI to unspecified places', () => {
    expect(round(Math.PI)).toBe(3);
});
