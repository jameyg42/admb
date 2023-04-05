const abs = require('../../out/ops/abs').default;

const nogaps = {
    name: 'nogaps',
    data: [
        {start:1, value:1},
        {start:2, value:1},
        {start:3, value:-1},
        {start:4, value:1},
        {start:5, value:-1},
    ]
}
const gaps = {
    name: 'gaps',
    data: [
        {start:1, value:1},
        {start:2, value:undefined},
        {start:3},
        {start:4, value:-1}
    ]
}

test('no gaps in data', () => {
    const r = abs(nogaps);
    expect(r.name).toBe('abs(nogaps)');
    expect(r.data.length).toBe(5);
    r.data.map(dp => dp.value)
    .forEach(v => {
        expect(v).toBe(1);
    }); 
});

test('with gaps in data', () => {
    const r = abs(gaps);
    expect(r.data.length).toBe(4);
    expect(r.data[1].value).toBeUndefined();
    expect(r.data[2].value).toBeUndefined();
    expect(r.data[3].value).toBe(1);
});
