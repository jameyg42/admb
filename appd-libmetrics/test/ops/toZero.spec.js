const toZero = require('../../out/ops/toZero').default;

test('positive values', () => {
    const t = {name:'positive_vals', data:[
        {start:1, value:12},
        {start:2, value:10},
        {start:3, value:5},
        {start:4, value:11}
    ]};
    const r = toZero(t);
    expect(r.name).toBe('toZero(positive_vals)');
    expect(r.data.map(dp => dp.value)).toStrictEqual([7,5,0,6]);
});
test('negative values', () => {
    const t = {name:'negative_vals', data:[
        {start:1, value:12},
        {start:2, value:10},
        {start:3, value:-5},
        {start:4, value:-2}
    ]};
    const r = toZero(t);
    expect(r.data.map(dp => dp.value)).toStrictEqual([17,15,0,3]);
});
test('has zero value', () => {
    const t = {name:'has_zero', data:[
        {start:1, value:12},
        {start:2, value:10},
        {start:3, value:0},
        {start:4, value:2}
    ]};
    const r = toZero(t);
    expect(r.data.map(dp => dp.value)).toStrictEqual([12,10,0,2]);
});
test('with gaps', () => {
    const t = {name:'has_gaps', data:[
        {start:1, value:12},
        {start:2, value:undefined},
        {start:3, value:10},
        {start:4, value:7}
    ]};
    const r = toZero(t);
    expect(r.data.map(dp => dp.value)).toStrictEqual([5,undefined,3,0]);
});
