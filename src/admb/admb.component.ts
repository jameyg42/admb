import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { BrowserPanelComponent } from './browser-panel/browser-panel.component';
import { HistoryService } from './history-list/history.service';
import { TabPanel, TabView } from 'primeng/tabview';

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

  @ViewChildren(BrowserPanelComponent)
  browsers: QueryList<BrowserPanelComponent>;

  @ViewChildren(TabPanel)
  tabs: QueryList<TabPanel>;

  @ViewChild(TabView)
  tabView: TabView;

  constructor(private historyService: HistoryService) {
    historyService.historySelect$.subscribe(evt => {
      const activeEditor = this.getActiveEditor();
      if (activeEditor) {
        if (evt.range) {
          activeEditor.range = evt.range;
        }
        activeEditor.expr = evt.expr;
      }
      this.palettebarExpanded = false;
    });
  }
  getActiveEditor(): BrowserPanelComponent {
    let selected = -1;
    this.tabs.forEach((t, i) => {
      if (t.selected) {
        selected = i;
      }
    });
    return selected >= 0 ? this.browsers.toArray()[selected ] : null;
  }
  tc = 1;
  newItem() {
    this.items.push({header: `Tab ${this.tc++}`});
    if (this.tabView) {
      setTimeout(() => {
        this.tabView.cd.detectChanges();
      }, 5);
    }
  }
  removeItem(item: number) {
    this.items.splice(item, 1);
  }

  ngOnInit() {
    this.newItem();
  }

}
