import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { BrowserPanelComponent } from './browser-panel/browser-panel.component';

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

  @ViewChildren('admb') components: QueryList<BrowserPanelComponent>;

  constructor() {
  }

  newItem() {
    this.items.push({header: 'new'});
  }
  removeItem(item: number) {
    this.items.splice(item, 1);
  }

  ngOnInit() {
    this.newItem();
  }

}
