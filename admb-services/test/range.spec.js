const range = require('../out/range');
const luxon = require('luxon');

test('can create from interval', () => {
    const start = luxon.DateTime.fromISO('2022-01-01T00:00:00.000Z');
    const interval = luxon.Interval.after(start, luxon.Duration.fromObject({hours:1,minutes:30}));
    const r = range.fromInterval(interval);
    expect(r.startTime).toBe(start.valueOf());
    expect(r.endTime).toBe(start.valueOf() + (((1 * 60) + 30) * 60) * 1000);
    expect(r.type).toBe('BETWEEN_TIMES');
})
