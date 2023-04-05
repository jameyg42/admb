const o = require('../out/objects');

test('merge works', () => {
    const r  = o.merge({a:1, b:1}, {b:2, c:2}, {d:3});
    expect(r).toEqual({a:1,b:2,c:2,d:3});
});

test('is works', () => {
    expect(o.is('string')('foo')).toBe(true);
    expect(o.isString('foo')).toBe(true);

    expect(o.isNumber(12)).toBe(true);
    expect(o.isNumber('14')).toBe(false);
});
test('as works', () => {
    expect(o.asNumber('13')).toBe(13);
    expect(isNaN(o.asNumber('foo'))).toBe(true);

    expect(o.asBoolean('True')).toBe(true);
    expect(o.asBoolean(false)).toBe(false);
    expect(o.asBoolean('false')).toBe(false);
    expect(o.asBoolean('foo')).not.toBeDefined();
});
