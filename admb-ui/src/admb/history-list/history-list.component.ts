import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HistoryService, HistoryEntry } from './history.service';

import { groupBy } from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'admb-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryListComponent implements OnInit {
  history: HistoryEntry[];

  constructor(private historyService: HistoryService, private changeDetectRef: ChangeDetectorRef) {
    historyService.historyChange$.subscribe(history => {
      this.history = history;
      this.changeDetectRef.detectChanges();
    });
  }
  select(entry, exprOnly) {
    this.historyService.select(entry, exprOnly);
  }
  remove(entry) {
    this.historyService.delete(entry.expr);
  }
  get groupedByDateHistory() {
    if (!this.history) {
      return [];
    }

    const sorted = this.history.slice().sort((a, b) => b.lastUsed - a.lastUsed);
    const groupedByDate = groupBy(sorted, v => moment(v.lastUsed).startOf('day').format('LL'));

    // the keyvalue pipe annoyingly re-sorts the keys, so don't use it
    return Object.entries(groupedByDate).map(([k,v]) => ({key: k, value: v}));
  }

  trackGroupBy(idx, group) {
    return group.key;
  }
  trackEntryBy(idx, entry: HistoryEntry): string {
    return entry.expr;
  }

  splitButtonMenu(entry) {
    return [
      {label: 'Select (expression only)', command: () => this.select(entry, true)},
      {separator: true},
      {label: 'Remove', command: () => this.remove(entry)}
    ];
  }

  ngOnInit(): void {
    this.history = this.historyService.history;
  }

}
