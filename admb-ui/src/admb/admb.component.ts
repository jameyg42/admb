import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserPanelComponent } from './browser-panel/browser-panel.component';
import { HistoryService } from './history-list/history.service';
import { Range } from '@admb/libmetrics/out/range';

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

  constructor(private historyService: HistoryService, private router: Router, private route: ActivatedRoute) {
    this.historyService.historySelect$.subscribe(evt => {
      const activeEditor = this.activeEditor;
      if (activeEditor) {
        if (evt.range) {
          activeEditor.range = Range.fromRangeLike(evt.range);
        }
        activeEditor.expr = evt.expr;
      }
      this.palettebarExpanded = false;
    });
  }

  ngOnInit() {
  }
}
