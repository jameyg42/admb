import * as moment from 'moment';

export interface Range {
  type: string;
  startTime?: number;
  endTime?: number;
  durationInMinutes?: number;
}

export function between(start, end): Range {
  start = moment.isMoment(start) ? start.valueOf() : start;
  end =  moment.isMoment(end) ? end.valueOf() : end;
  return {
    type: 'BETWEEN_TIMES',
    startTime: Math.min(start, end),
    endTime: Math.max(start, end)
  };
}
export function beforeNow(duration): Range {
  return {
    type: 'BEFORE_NOW',
    durationInMinutes: moment.isDuration(duration) ?  duration.asMinutes() : duration
  };
}
export function fix(r: Range): Range {
  if (r.type === 'BEFORE_NOW') {
    return between(moment().subtract(r.durationInMinutes, 'minutes'), moment())
  }
  return r;
}
export function zoom(r: Range, duration) {
  r = fix(r);
  duration = moment.isDuration(duration) ? duration : moment.duration(duration, 'minutes');
  return between(moment(r.startTime).subtract(duration), moment(r.endTime).add(duration));
}
export function slide(r: Range, duration) {
  r = fix(r);
  duration = moment.isDuration(duration) ? duration : moment.duration(duration, 'minutes');
  return between(moment(r.startTime).add(duration), moment(r.endTime).add(duration));
}
