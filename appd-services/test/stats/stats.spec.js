const stats = require('../../lib/stats/stats');

describe('reducers are exported correctly', () => {
    test('sum', () => {
        const r = stats.sum([1, 2, 5]);
        expect(r).toBe(8);
    });
});

describe('sort', () => {
    test('ascending (default)', () => {
        const r = stats.sort([3,4,2,1]);
        expect(r).toEqual(   [1,2,3,4]);
    });
    test('descending', () => {
        const r = stats.sort([3,4,2,1], true);
        expect(r).toEqual(   [4,3,2,1]);
    });
    test('ascending with duplicates', () => {
        const r = stats.sort([8, 5, 2, 5, 3, 8, 1]);
        expect(r).toEqual(   [1, 2, 3, 5, 5, 8, 8]);
    });
});

describe('array ranking', () => {
    test('with no duplicates', () => {
        const r = stats.rank([3, 2, 5, 1]);
        expect(r).toEqual(   [3, 2, 4, 1]);
    });
    test('containing duplicates', () => {
        const r = stats.rank([8, 5, 2, 5, 3, 8, 1]);
        expect(r).toEqual(   [5, 4, 2, 4, 3, 5, 1]);
    });
});
