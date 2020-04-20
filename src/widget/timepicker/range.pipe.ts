import { Pipe, PipeTransform } from '@angular/core';
import { Range } from '../../admb/svc/model';
import * as moment from 'moment';
import { isString } from 'lodash';
@Pipe({
  name: 'range'
})
export class RangePipe implements PipeTransform {

  transform(value: Range|string, ...args: unknown[]): string {
    if (!value) {
      return '-';
    }
    if (isString(value)) {
      return value as string;
    }

    if (value.type === 'BEFORE_NOW') {
      const d = moment.duration(value.durationInMinutes, 'minutes');
      return d.humanize();
    }
    const today = moment();
    const start = moment(value.startTime);
    const end   = moment(value.endTime);
    if (start.isSame(end, 'day')) {
      if (start.isSame(today, 'day')) {
        return `${start.format('LT')} to ${end.format('LT')}`;
      } else {
        return `${start.format('L LT')} to ${end.format('LT')}`;
      }
    } else {
      return `${start.format('L LT')} to ${end.format('L LT')}`;
    }
  }
}
