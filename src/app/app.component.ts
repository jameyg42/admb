import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { BrowserPanelComponent } from 'src/admb/browser-panel/browser-panel.component';
import { LoginService } from './login/login.service';

@Component({
  selector: 'admb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'appd-browser-webui';
  items = [];

  user: any;
  userLoading = true;

  palettebarExpanded: boolean;
  palettebarPinned: boolean;

  @ViewChildren('admb') components: QueryList<BrowserPanelComponent>;

  constructor(private loginService: LoginService) {
    loginService.currentUser()
      .then(user => {
        this.user = user;
        this.userLoading = false;
      })
      .catch(err => {
      this.user = null;
      this.userLoading = false;
    });
    loginService.userChange$.subscribe(user => {
      this.user = user;
    });
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
