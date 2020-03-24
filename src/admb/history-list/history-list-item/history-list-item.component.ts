import { Component, OnInit, Input } from '@angular/core';
import { HistoryEntry, HistoryService } from '../history.service';

@Component({
  selector: 'admb-history-list-item',
  templateUrl: './history-list-item.component.html',
  styleUrls: ['./history-list-item.component.scss']
})
export class HistoryListItemComponent implements OnInit {
  @Input()
  entry: HistoryEntry;

  @Input()
  timeFormat: 'shortTime';

  expanded = false;

  constructor(private historyService: HistoryService) {
  }

  toggle() {
    this.expanded = !this.expanded;
  }

  setExpr(event) {
    this.historyService.select(this.entry, true)
  }
  setAll(event) {
    this.historyService.select(this.entry);

  }

  ngOnInit(): void {
  }


}
