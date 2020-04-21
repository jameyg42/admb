import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Range } from '../svc/model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  history = [] as HistoryEntry[];
  private historyChange = new Subject<HistoryEntry[]>();
  private historySelect = new Subject<HistorySelectEvent>();

  historyChange$ = this.historyChange.asObservable();
  historySelect$ = this.historySelect.asObservable();

  constructor() {
    this.history = storage.get();
  }

  push(expr: string, range: Range) {
    const e: HistoryEntry = {
      expr, range,
      lastUsed: new Date().getTime(),
      useCount: 1
    };
    const ee = this._delete(expr);
    if (ee) {
      e.useCount = ee.useCount + 1;
    }
    this.history.splice(0, 0, e);
    this.handleChange();
  }
  _delete(expr) {
    const currentPos = this.history.findIndex(h => h.expr === expr);
    if (currentPos >= 0) {
      return this.history.splice(currentPos, 1).shift();
    }
    return null;
  }
  delete(expr) {
    this._delete(expr);
    this.handleChange();
  }
  clear() {
    this.history = [];
    this.handleChange();
  }
  handleChange() {
    storage.put(this.history);
    this.historyChange.next(this.history);
  }
  select(entry, exprOnly=false) {
    this.historySelect.next(exprOnly ? {expr: entry.expr} : {expr: entry.expr, range: entry.range});
  }
}

const storageKey = 'metlife.admb.history';
const storage = {
  get: () => {
    return localStorage ? JSON.parse(localStorage.getItem(storageKey)) || [] : [];
  },
  put: (history) => {
    localStorage && localStorage.setItem(storageKey, JSON.stringify(history));
  }
}

export interface HistoryEntry {
  expr: string;
  lastUsed: number;
  useCount: number;
  range?: Range;
}

export interface HistorySelectEvent {
  expr: string;
  range?: Range;
}
