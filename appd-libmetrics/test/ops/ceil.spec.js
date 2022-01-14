const ceil = require('../../out/ops/ceil').default;

test('nogaps', () => {
    const t = {name:'nogaps', data:[
        {start:1, value:100},
        {start:2, value:50},
        {start:3, value:-100},
        {start:4, value:30}
    ]};
    const r = ceil(t, 50);
    expect(r.name).toBe('ceil(nogaps)');
    expect(r.data[0].value).toBe(50);
    expect(r.data[1].value).toBe(50);
    expect(r.data[2].value).toBe(-100);
    expect(r.data[3].value).toBe(30);
});
test('gaps', () => {
    const t = {name:'gaps', data:[
        {start:1, value:100},
        {start:2, value: 40},
        {start:3, value:undefined},
        {start:4}
    ]};
    const r = ceil(t, 50);
    expect(r.data[0].value).toBe(50);
    expect(r.data[1].value).toBe(40);
    expect(r.data[2].value).toBeUndefined();
    expect(r.data[3].value).toBeUndefined();
});
