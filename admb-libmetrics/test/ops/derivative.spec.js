const derivative = require('../../out/ops/derivative').default;

test('nogaps', () => {
    const t = {name:'nogaps', data:[
        {start:1, value: 2},
        {start:2, value: 4},
        {start:3, value: 2},
        {start:4, value: 2},
        {start:5, value: -4},
        {start:6, value: 1}
    ]};
    const r = derivative(t);
    expect(r.name).toBe('derivative(nogaps)');
    expect(r.data.length).toBe(6);
    expect(r.data[0].value).toBe(0);
    expect(r.data[1].value).toBe(2);
    expect(r.data[2].value).toBe(-2);
    expect(r.data[3].value).toBe(0);
    expect(r.data[4].value).toBe(-6);
    expect(r.data[5].value).toBe(5);
});
test('gaps', () => {
    const t = {name:'gaps', data:[
        {start:1, value: 2},
        {start:2, value: 4},
        {start:3, value:undefined},
        {start:4},
        {start:5, value: 2}
    ]};
    const r = derivative(t);
    expect(r.data[0].value).toBe(0);
    expect(r.data[1].value).toBe(2);
    expect(r.data[2].value).toBe(-4);
    expect(r.data[3].value).toBe(0);
    expect(r.data[4].value).toBe(2);
});
