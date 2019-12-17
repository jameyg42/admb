import { Component, ViewChildren, QueryList } from '@angular/core';
import { BrowserPanelComponent } from 'src/admb/browser-panel/browser-panel.component';

@Component({
  selector: 'admb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'appd-browser-webui';
  items = [];

  @ViewChildren('admb') components: QueryList<BrowserPanelComponent>;

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
