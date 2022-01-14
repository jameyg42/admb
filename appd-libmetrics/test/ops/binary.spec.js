const binary = require('../../out/ops/binary').default;

test('nogaps', () => {
    const t = {name:'nogaps', data:[
        {start:1, value:100},
        {start:2, value:0},
        {start:3, value:-20},
        {start:4, value:0}
    ]};
    const r = binary(t);
    expect(r.name).toBe('binary(nogaps)');
    expect(r.data[0].value).toBe(1);
    expect(r.data[1].value).toBe(0);
    expect(r.data[2].value).toBe(1);
    expect(r.data[3].value).toBe(0);
});
test('gaps', () => {
    const t = {name:'gaps', data:[
        {start:1, value:0},
        {start:2, value:-20},
        {start:3, value:undefined},
        {start:4}
    ]};
    const r = binary(t);
    expect(r.data[0].value).toBe(0);
    expect(r.data[1].value).toBe(1);
    expect(r.data[2].value).toBe(0);
    expect(r.data[3].value).toBe(0);
});
