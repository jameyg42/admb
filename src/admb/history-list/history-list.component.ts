import { Component, OnInit } from '@angular/core';
import { HistoryService, HistoryEntry } from './history.service';

@Component({
  selector: 'admb-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit {
  history: HistoryEntry[];

  constructor(private historyService: HistoryService) {
    historyService.historyChange$.subscribe(history => {
      this.history = history;
    });
  }
  select(entry, exprOnly) {
    this.historyService.select(entry, exprOnly);
  }
  remove(entry) {
    this.historyService.delete(entry.expr);
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
