import { Range } from '@admb/libmetrics/out/range';
import { DateTime } from '@admb/libutils/out/time';

interface PresetSet {
  section: string;
  sets: (Preset|'-')[]
}
interface Preset {
  label: string;
  fn: () => Range;
}

export const PRESETS:PresetSet[]= [
  {
    section: 'Standard Presets',
    sets : [
      {
        label: '5 minutes',
        fn: () => Range.beforeNow({"minutes":5})
      },
      {
        label: '15 minutes',
        fn: () => Range.beforeNow({"minutes":15})
      },
      {
        label: '30 minutes',
        fn: () => Range.beforeNow({"minutes":30})
      },
      '-',
      {
        label: '1 hour',
        fn: () => Range.beforeNow({"hours":1})
      },
      {
        label: '2 hours',
        fn: () => Range.beforeNow({"hours":2})
      },
      {
        label: '4 hours',
        fn: () => Range.beforeNow({"hours":4})
      },
      {
        label: '8 hours',
        fn: () => Range.beforeNow({"hours":8})
      },
      '-',
      {
        label: '1 day',
        fn: () => Range.beforeNow({"days":1})
      },
      {
        label: '3 days',
        fn: () => Range.beforeNow({"days":3})
      },
      {
        label: '1 week',
        fn: () => Range.beforeNow({"weeks":1})
      },
      {
        label: '8 days',
        fn: () => Range.beforeNow({"days":8})
      },
      {
        label: '2 weeks',
        fn: () => Range.beforeNow({"weeks":2})
      },
      '-',
      {
        label: '1 month',
        fn: () => Range.beforeNow({"months":1})
      },
      {
        label: '3 months',
        fn: () => Range.beforeNow({"months":3})
      },
    ]
  }, {
    section: 'Other',
    sets: [
      {
        label: 'Today',
        fn : () => Range.between(DateTime.now().startOf('day'), DateTime.now())
      },
      {
        label: 'Yesterday',
        fn : () => Range.between(DateTime.now().startOf('day').minus({'day':1}), DateTime.now().startOf('day'))
      },
      {
        label: 'This week',
        fn: () => Range.between(DateTime.now().startOf('week'), DateTime.now())
      },
      {
        label: 'A week ago',
        fn: () => Range.between(DateTime.now().minus({'week':1}).startOf('day'), DateTime.now().minus({'week':1}).endOf('day'))
      },
      {
        label: 'Last week',
        fn: () => Range.between(DateTime.now().minus({'week':1}).startOf('week'), DateTime.now().startOf('week'))
      },
      {
        label: 'This month',
        fn: () => Range.between(DateTime.now().startOf('month'), DateTime.now())
      },
      {
        label: 'Last month',
        fn: () => Range.between(DateTime.now().minus({'month':1}).startOf('month'), DateTime.now().startOf('month'))
      }
    ]
  }
];
