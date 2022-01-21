const arrays = require('../out/arrays');

describe('reducer utilities', () => {
    test('reducer or fn', () => {
        const s = arrays.reducerOrFn((p, c) => p + c);
        expect(s([1,2,3])).toBe(6);
        expect([1,2,3].reduce(s)).toBe(6);
    });

    test('mock reducer', () => {
        const m = arrays.mockReducer((a) => {
            return a.sort().map(v => v.substring(1)).join(' ');
        });
        expect(['2quick', '1the', '4fox', '3brown'].reduce(m)).toBe('the quick brown fox');
    });

    test('with fixed initial', () => {
        const f = arrays.reducerWithFixedInitial(100, (p,c) => p + c);
        expect([1,2,3].reduce(f)).toBe(106);
    });
    test('with fixed initial and provided initial', () => {
        const f = arrays.reducerWithFixedInitial(100, (p,c) => p + c);
        expect([1,2,3].reduce(f, 400)).toBe(106);
    });
});

describe('sort utilities', () => {
    test('numeric ascending (default)', () => {
        expect(arrays.nsort([12,1,1974])).toStrictEqual([1, 12, 1974]);
    });
    test('numeric descending', () => {
        expect(arrays.nsort([12,1,1974], true)).toStrictEqual([1974, 12, 1]);
    });
});

describe('array zip', () => {
    test('two equal length arrays', () => {
        const a1 = ['a','b','c'];
        const a2 = [1,2,3];
        expect(arrays.zip(a1, a2)).toStrictEqual([['a',1], ['b',2], ['c',3]]);
    });
    test('two unequal length arrays', () => {
        const a1 = ['a','b','c'];
        const a2 = [1,2,3,4,5];
        expect(arrays.zip(a1, a2)).toStrictEqual([['a',1], ['b',2], ['c',3], [undefined,4], [undefined,5]]);
    });
    test('called as reducer', () => {
        const a1 = ['a','b','c'];
        const a2 = [1,2,3,4,5];
        expect([a1,a2].reduce(arrays.zipReduce)).toStrictEqual([['a',1], ['b',2], ['c',3], [undefined,4], [undefined,5]]);
    })
});
