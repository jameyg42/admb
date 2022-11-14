import { isNumber } from '@metlife/appd-libutils';
import { DateTime, Duration, DurationLikeObject, DurationUnit, Interval } from '@metlife/appd-libutils/out/time';
import { Range as IRange, RangeType } from './api';


// FIXME this shouldn't be tied to AppD's Range format - that conversion should happen in the 
// AppD Pipeline provider.  But we still need a way to represent this more complex range as
// a pure-data value (ISO standards for Interval and Duration)
//   https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
//   https://en.wikipedia.org/wiki/ISO_8601#Durations
// the api.Range vs. range.Range name collision (confusion) will be addressed at the same time
// this FIXME is

export const ZERO = Duration.fromMillis(0);

/**
 * A type that represents a time Range.  Ranges are either FIXED (type=BETWEEN_TIMES) between a given start/end time, or
 * RELATIVE (type=BEFORE_NOW) to `now` by a given Duration (resolved to minutes).
 * Ranges are immutable - modification methods always return new Range instances.
 * Special attention should be given to the `toXXX()` vs. `getXXX()` methods - the former will work regardless of `type`
 * performing the necessary conversions to return the asked-for object.  
 */
export class Range implements IRange {
  constructor(public readonly type:RangeType, private readonly startDateTime?:DateTime, private readonly endDateTime?:DateTime, private duration?:Duration) {
    // ecch - luxon doesn't have a greate "humanized" representation of Durations, so we'll attempt set it's to toHuman()
    // method up for success here.
    if (this.duration !== undefined) {
      const weeks = this.duration.as('weeks');
      if (weeks === Math.floor(weeks)) {
        this.duration = this.duration.shiftTo('weeks');
      } 
      else {
        const units = ['months', 'days', 'hours', 'minutes'] as DurationUnit[];
        this.duration = this.duration.shiftTo(...units);
        this.duration = this.duration.shiftTo(...(units.filter(unit => (this.duration as Duration).get(unit) > 0)));
      }
    }
  }
  static fromRangeLike(range:IRange) {
    if (range instanceof Range) {
      return range;
    }
    return new Range(
      range.type, 
      range.startTime ? DateTime.fromMillis(range.startTime) : undefined, 
      range.endTime ? DateTime.fromMillis(range.endTime) :  undefined, 
      range.durationInMinutes ? Duration.fromObject({minute:range.durationInMinutes}) : undefined
    );
  }
  static fromInterval(interval:Interval) {
    return Range.between(interval.start, interval.end);
  }
  static beforeNow(durationLike:DurationLike) {
    const duration = asDuration(durationLike);
    return new Range("BEFORE_NOW", undefined, undefined, duration);
  }
  static between(start:DateTimeLike, end:DateTimeLike): Range {
    start = asDateTime(start);
    end =  asDateTime(end);
    return new Range("BETWEEN_TIMES", start, end);
  }

  // api.Range interface
  get startTime():number|undefined {
    return this.startDateTime ? Math.floor(this.startDateTime.toMillis()) : undefined;
  }
  get endTime():number|undefined {
    return this.endDateTime ? Math.floor(this.endDateTime.toMillis()) : undefined;
  }
  get durationInMinutes():number|undefined {
    return this.duration ? Math.floor(this.duration.as('minutes')) : undefined;
  }
  toRangeLikeObject() : IRange {
    return {
      type: this.type,
      startTime: this.startTime,
      endTime: this.endTime,
      durationInMinutes: this.durationInMinutes
    };
  }
  toJSON():any {
    return this.toRangeLikeObject();
  }

  /**
   * for BETWEEN_TIMES (aka "FIXED") Ranges, returns the Range's start DateTime. Compare to
   * `toStartTime()` which always returns a DateTime
   * @returns for BETWEEN_TIMES, the start time, otherwise `undefined`
   */
  getStartDateTime():DateTime|undefined {
    return this.startDateTime;
  }
  /**
   * returns the start DateTime represented by this Range, regardless of `type`
   * @returns 
   */
  toStartDateTime():DateTime {
    return this.startDateTime ?? DateTime.now().minus(this.duration as Duration);
  }
  /**
   * for BETWEEN_TIMES (aka "FIXED") Ranges, returns the Range's end DateTime.  Comare to
   * `toEndTime()` which always returns a DateTime.
   * @returns for BETWEEN_TIMES Ranges, the end time, otherwise `undefined` 
   */
  getEndDateTime():DateTime|undefined {
    return this.endDateTime;
  }
  /**
   * returns the end DateTime represented by this Range, regardless of `type`
   * @returns
   */
  toEndDateTime():DateTime {
    return this.endDateTime ?? DateTime.now();
  }
  /**
   * returns the Interval represented by this Range, regardless of `type`.
   * @returns 
   */
  toInterval():Interval {
    const fixed = this.fix();
    return Interval.fromDateTimes(fixed.startDateTime as DateTime, fixed.endDateTime as DateTime);
  }
  /**
   * for BEFORE_NOW (aka "RELATIVE") Ranges, returns the Range's duration.  Compare to `toDuration()` which always
   * returns a Duration
   * @returns the duration for BETWEEN_TIMES ranges, otherwise `undefined`
   */
  getDuration():Duration|undefined {
    return this.duration;
  }
  /**
   * returns the Duration represented by this Range regardless of `type`.
   * @returns 
   */
  toDuration():Duration {
    return this.duration ?? (this.endDateTime as DateTime).diff(this.startDateTime as DateTime);
  }

  /**
   * returns a new BETWEEN_TIMES (aka "FIXED") Range based on the current Range
   * @returns 
   */
  fix():Range {
    if (this.type == "BEFORE_NOW") {
      const now = DateTime.now();
      return Range.between(now.minus(this.duration as Duration), now);
    } else {
      return this;
    }
  }

  /**
   * returns a new Range expanded by the given start/end paddings.  The start/end padding is
   * subtracted/added from/to the respective fixed start/end times.  Negative durations
   * have the effect of shriking (instead of expanding) the Range.
   * @param frontOrBothPadding
   * @param endPadding
   * @returns 
   */
  expand(frontOrBothPadding:DurationOrMagnitude="OUT", endPadding?:DurationOrMagnitude): Range {
    endPadding = endPadding ?? frontOrBothPadding;
    const front = this.durationOrScaled(frontOrBothPadding);
    const end = this.durationOrScaled(endPadding);

    const fixed = this.fix();
    const expandedStartTime = (fixed.startDateTime as DateTime).minus(front);
    const expandedEndTime = DateTime.min((fixed.endDateTime as DateTime).plus(end), DateTime.now());
 
    return Range.between(expandedStartTime, expandedEndTime);
  }
  /**
   * returns a new Range shrunk by the given start/end paddings.  A convenience short-cut 
   * to expand(front.negate(), end.negate())
   * @param frontLike 
   * @param endLike 
   * @returns 
   */
  shrink(frontOrBothTrimming:DurationOrMagnitude="OUT", endTrimming?:DurationOrMagnitude) {
    endTrimming = endTrimming ?? frontOrBothTrimming;
    return this.expand(this.durationOrScaled(frontOrBothTrimming).negate(), this.durationOrScaled(endTrimming).negate());
  }
  /**
   * returns a new Range slid forward by the given duration or magnitude.  Convenience short-cut to
   * expand(duration.negate(), duration)
   * @param durationLike 
   * @returns 
   */
  slide(durationOrMagnitude:DurationOrMagnitude="LEFT") {
    const slid = this.durationOrScaled(durationOrMagnitude);
    return this.expand(slid.negate(), slid);
  }
  /**
   * returns a new Range "zoomed" by expanding the current range by the current duration times the 
   * given zoom level.  
   * @param level 
   * @returns 
   */
  zoom(durationOrMagnitude:DurationOrMagnitude="OUT"):Range {
    const zoomed = this.durationOrScaled(durationOrMagnitude);
    return this.expand(zoomed);
  }


  private durationOrScaled(durationOrMagnitude:DurationOrMagnitude):Duration {
    const durationInMillis = this.toDuration().toMillis();
    if (DynamicMagnitude[durationOrMagnitude as DynamicMagnitudeStrings] !== undefined) {
      const dyn = DynamicMagnitude[durationOrMagnitude as DynamicMagnitudeStrings];
      const dir = dyn <= DynamicMagnitude.IN ? -1 : 1;
      return Duration.fromMillis(durationInMillis * 0.25 * dir);
    }
    else if (isNumber(durationOrMagnitude)) {
      return Duration.fromMillis(durationInMillis * (durationOrMagnitude as number))
    }
    else {
      return asDuration(durationOrMagnitude as DurationLike);
    }
  }
}
/**
 * This is like Luxon's own DurationLike type, but 'number' is in minutes vs. Luxon's milliseconds
 */
export type DurationLike = Duration|DurationLikeObject|number;
export type DateTimeLike = DateTime|number;
function asDuration(d:DurationLike):Duration {
  return Duration.isDuration(d) ? d as Duration : (Duration.fromObject(isNumber(d) ? {minutes:d as number} : d as DurationLikeObject));
}
function asDateTime(dt:DateTimeLike):DateTime {
  return isNumber(dt) ? DateTime.fromMillis(dt as number) : dt as DateTime;
}
function asRange(range:IRange) {
  return range instanceof Range ? range as Range : Range.fromRangeLike(range);
}

export type DurationOrMagnitude = DurationLike|number|DynamicMagnitudeStrings;
export enum DynamicMagnitude  {
  LEFT, IN, OUT, RIGHT
}
export type DynamicMagnitudeStrings = keyof typeof DynamicMagnitude;



// REVISITME should these exist?
export const beforeNow = Range.beforeNow;
export const between = Range.between;

export function fix(r: IRange): Range {
  return asRange(r).fix();
}
export function expand(r: IRange, startOrBothPadding?:DurationLike, endPadding?:DurationLike) {
  return asRange(r).expand(startOrBothPadding, endPadding);
}
export function slide(r: IRange, duration:DurationLike): Range {
  return asRange(r).slide(duration);
}
export function zoom(r: IRange, level:number): Range {
  return asRange(r).zoom(level);
}
