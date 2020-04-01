import { Component, OnInit } from '@angular/core';
import { LoginService } from './login/login.service';

@Component({
  selector: 'admb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'appd-browser-webui';

  user: any;
  userLoading = true;
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
  ngOnInit() {
  }
}
