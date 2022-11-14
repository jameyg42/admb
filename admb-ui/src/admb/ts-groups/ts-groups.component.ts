import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { MetricTimeseries } from '../svc/model';
import { Observable, of } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'admb-ts-groups',
  templateUrl: './ts-groups.component.html',
  styleUrls: ['./ts-groups.component.scss']
})
export class TsGroupsComponent implements OnInit {
  private _groups: any; // the array of array nesting can be arbitrarily deep, so just use any

  flattenedGroups$: Observable<MetricTimeseries[][]>;
  noResults = false;

  constructor() { }

  ngOnInit() {
  }

  get groups() {
    return this._groups;
  }
  @Input()
  set groups(groups: any) {
    this.noResults = false;
    this._groups = groups;
    function flatten(gs, r) {
      if (Array.isArray(gs) && Array.isArray(gs[0])) {
        for (const g of gs) {
          flatten(g, r);
        }
      } else if (Array.isArray(gs)) {
        r.push(gs);
      } else {
        // weird - should never be here
        r.push([gs]);
      }
    }
    const flat = [];
    flatten(groups, flat);
    if (flat.length == 0 || flat.every(f => f.length == 0)) {
      this.noResults = true;
    }
    this.flattenedGroups$ = of(flat);
  }
}

