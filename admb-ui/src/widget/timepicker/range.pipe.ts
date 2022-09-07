import { Pipe, PipeTransform } from '@angular/core';
import { Range } from '@metlife/appd-libmetrics/out/range';
import { Range as RangeLike } from '@metlife/appd-libmetrics/out/api';
import { isString } from '@metlife/appd-libutils/out/objects';
import { DateTime } from '@metlife/appd-libutils/out/time';

const TIME_SIMPLE = "HH:mm";
const DATETIME_SIMPLE = 'LLL-dd HH:mm';
@Pipe({
  name: 'range'
})
export class RangePipe implements PipeTransform {

  transform(value: RangeLike|string, ...args: unknown[]): string {
    if (!value) {
      return '-';
    }
    if (isString(value)) {
      return value as string;
    }
    const range = Range.fromRangeLike(value as RangeLike);
    if (range.type === 'BEFORE_NOW') {
      return range.getDuration().toHuman({listStyle:'narrow'});
    }
    const today = DateTime.now();
    const start = range.getStartDateTime();
    const end   = range.getEndDateTime();
    if (start.hasSame(end, 'day')) {
      if (start.hasSame(today, 'day')) {
        return `${start.toFormat(TIME_SIMPLE)} to ${end.toFormat(TIME_SIMPLE)}`;
      } else {
        return `${start.toFormat(DATETIME_SIMPLE)} to ${end.toFormat(TIME_SIMPLE)}`;
      }
    } else {
      return `${start.toFormat(DATETIME_SIMPLE)} to ${end.toFormat(DATETIME_SIMPLE)}`;
    }
  }
}
