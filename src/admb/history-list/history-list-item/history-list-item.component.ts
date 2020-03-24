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

  setExpr() {
    this.historyService.select(this.entry, true);
  }
  setAll() {
    this.historyService.select(this.entry);
  }
  deleteExpr() {
    this.historyService.delete(this.entry.expr);
  }

  menuModel() {
    return  [
    {label: 'Set All', icon: 'pi pi-angle-double-left', command: () => this.setAll()},
    {label: 'Set Expression', icon: 'pi pi-angle-left', command: () => this.setExpr()},
    {separator: true},
    {label: 'Delete Item', icon: 'pi pi-trash', command: () => this.deleteExpr()}
    ];
  }
  ngOnInit(): void {
  }


}
