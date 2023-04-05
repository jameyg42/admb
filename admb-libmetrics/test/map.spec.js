const map = require('../out/map');
const samples = require('./samples').t1_d4h_p1m;

// currently this single test covers the entire map module
test('map values with mapper and name', () => {
    const t = samples.cpm;
    const r = map.mapValues(t, (v) => -1, 'negative_one');
    expect(r).not.toBe(t);
    expect(r).not.toEqual(t);
    expect(r.name).toBe(`negative_one(${t.name})`);
    expect(r.data.length).toBe(t.data.length);
    r.data.forEach((dp,i) => {
        expect(dp.start).toBe(t.data[i].start);
        expect(dp.value).toBe(-1);
    });
});
