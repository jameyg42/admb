import { Duration, DateTime, Interval } from '@metlife/appd-libutils/out/time';

export interface FixedRange {
    type: ('BETWEEN_TIMES'),
    startTime: number,
    endTime: number
}
export interface RelativeRange {
    type: ('BEFORE_NOW'),
    durationInMinutes: number
}
export type Range = FixedRange|RelativeRange;

export function beforeNow(duration:Duration|number):RelativeRange {
    duration = duration instanceof Duration ? duration : Duration.fromObject({minutes:duration})
    return {
        type: 'BEFORE_NOW',
        durationInMinutes: duration.as('minutes')
    }
}
export function between(startTime:DateTime|number, endTime:DateTime|number):FixedRange {
    startTime = startTime instanceof DateTime ?  startTime.valueOf() : startTime;
    endTime = endTime instanceof DateTime ? endTime.valueOf() : endTime;

    if (startTime > endTime) {
        var t = startTime;
        startTime = endTime;
        endTime = t;
    }
    return {
        type: 'BETWEEN_TIMES',
        startTime: startTime,
        endTime: endTime,
    }
}
export function before(end:DateTime, duration:Duration):FixedRange {
    return between(end.minus(duration), end);
}
export function after(start:DateTime, duration?:Duration):FixedRange {
    return between(start, duration ? start.plus(duration) : DateTime.now());
}
export function fix(range:Range):FixedRange {
    if (range.type === 'BETWEEN_TIMES') return range;
    const end = DateTime.now();
    const start = end.minus(Duration.fromObject({minutes:range.durationInMinutes}));
    return between(start, end);
}
export function fromInterval(interval:Interval) {
    return between(interval.start, interval.end);
}

export const defaultRange = beforeNow(60);
