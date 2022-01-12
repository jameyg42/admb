const rank = require('../out/rank').default;

test('rank - no dupes', () => {
    const s =                     [8,6,7,5,3,0,9];
    expect(rank(s)).toStrictEqual([6,4,5,3,2,1,7]);
});

test('rank - with dupes', () => {
    const s =                     [8,6,7,6,5,3,3,7,0,9];
    expect(rank(s)).toStrictEqual([6,4,5,4,3,2,2,5,1,7]);
});
