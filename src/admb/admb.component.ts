import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { BrowserPanelComponent } from './browser-panel/browser-panel.component';
import { HistoryService } from './history-list/history.service';

@Component({
  selector: 'admb-panel',
  templateUrl: './admb.component.html',
  styleUrls: ['./admb.component.scss']
})
export class AdmbPanelComponent implements OnInit {
  title = 'appd-browser-webui';
  items = [];

  palettebarExpanded: boolean;
  palettebarPinned: boolean;

  @ViewChild(BrowserPanelComponent)
  activeEditor: BrowserPanelComponent;

  constructor(private historyService: HistoryService) {
    historyService.historySelect$.subscribe(evt => {
      const activeEditor = this.activeEditor;
      if (activeEditor) {
        if (evt.range) {
          activeEditor.range = evt.range;
        }
        activeEditor.expr = evt.expr;
      }
      this.palettebarExpanded = false;
    });
  }

  ngOnInit() {
  }

}
