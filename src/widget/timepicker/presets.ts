import {Range, between, beforeNow, zoom, slide} from './range';
import * as moment from 'moment';
export const PRESETS = [
  {
    section: 'Standard Presets',
    sets : [
      {
        label: '5 minutes',
        fn: () => beforeNow(5)
      },
      {
        label: '15 minutes',
        fn: () => beforeNow(15)
      },
      {
        label: '30 minutes',
        fn: () => beforeNow(30)
      },
      '-',
      {
        label: '1 hour',
        fn: () => beforeNow(moment.duration(1, 'hour'))
      },
      {
        label: '2 hours',
        fn: () => beforeNow(moment.duration(2, 'hour'))
      },
      {
        label: '4 hours',
        fn: () => beforeNow(moment.duration(4, 'hour'))
      },
      '-',
      {
        label: '1 day',
        fn: () => beforeNow(moment.duration(1, 'day'))
      },
      {
        label: '3 days',
        fn: () => beforeNow(moment.duration(3, 'day'))
      },
      {
        label: '1 week',
        fn: () => beforeNow(moment.duration(7, 'day'))
      },
      {
        label: '2 weeks',
        fn: () => beforeNow(moment.duration(14, 'day'))
      },
      '-',
      {
        label: '1 month',
        fn: () => beforeNow(moment.duration(30, 'day'))
      },
      {
        label: '3 months',
        fn: () => beforeNow(moment.duration(90, 'day'))
      },
    ]
  }, {
    section: 'Other',
    sets: [
      {
        label: 'Yesterday',
        fn : () => between(moment().subtract(1, 'day').startOf('day'), moment().startOf('day'))
      },
      {
        label: 'This week',
        fn: () => between(moment().startOf('week'), moment())
      },
      {
        label: 'Last week',
        fn: () => between(moment().subtract(1, 'week').startOf('week'), moment().startOf('week'))
      },
      {
        label: 'This month',
        fn: () => between(moment().startOf('month'), moment())
      },
      {
        label: 'Last month',
        fn: () => between(moment().subtract(1, 'month').startOf('month'), moment().startOf('month'))
      }
    ]
  }
];
