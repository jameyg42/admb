import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { MetricTimeseriesGroup } from '../svc/model';
import { Observable, of } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'admb-ts-groups',
  templateUrl: './ts-groups.component.html',
  styleUrls: ['./ts-groups.component.scss']
})
export class TsGroupsComponent implements OnInit {
  private _groups: any; // the array of array nesting can be arbitrarily deep, so just use any

  plottedSeriesGroups$: Observable<MetricTimeseriesGroup[]>;
  tabularSeriesGroups$: Observable<MetricTimeseriesGroup[]>
  noResults = false;

  constructor() { }

  ngOnInit() {
  }

  get groups() {
    return this._groups;
  }
  @Input()
  set groups(groups: MetricTimeseriesGroup[]) {
    this.noResults = false;
    if (!groups || groups.length == 0 || groups.every(f => f.length == 0)) {
      this.noResults = true;
    }
    this.plottedSeriesGroups$ = of(groups.map(g => g.filter(ts => ts.metadata.plot.type !== 'table')).filter(g => g.length > 0));
    this.tabularSeriesGroups$ = of(groups.map(g => g.filter(ts => ts.metadata.plot.type === 'table')).filter(g => g.length > 0));
  }
}

