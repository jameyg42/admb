import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MetricTimeseries } from '../svc/model';

import {avg} from '@metlife/appd-libstats/out/mean';
import {min} from '@metlife/appd-libstats/out/min';
import {max} from '@metlife/appd-libstats/out/max';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'admb-ts-table',
  templateUrl: './ts-table.component.html',
  styleUrls: ['./ts-table.component.scss']
})
export class TsTableComponent {
  @Input()
  _timeseriesGroup: MetricTimeseries[];

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'avg', header: 'Avg' },
    { field: 'min', header: 'Min' },
    { field: 'max', header: 'Max' }
  ];
  seriesRows: SeriesRow[] = [];

  get timeseriesGroup(): MetricTimeseries[] {
    return this._timeseriesGroup;
  }
  @Input()
  set timeseriesGroup(tss: MetricTimeseries[]) {
    this._timeseriesGroup = tss;
    this.seriesRows = tss.map(ts => {
      const dp = ts.data.map(v => v.value);
      return {
        name: ts.fullName,
        avg: avg(dp),
        min: min(dp),
        max: max(dp)
      }
    })
  }
}

interface SeriesRow {
  name: string;
  avg: number;
  min: number;
  max: number;
}
