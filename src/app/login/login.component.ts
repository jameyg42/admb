import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as xor from '../../xor';
import { SelectItem } from 'primeng/api/selectitem';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'admb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: any;

  loginForm: FormGroup;
  url: string;

  controllers: SelectItem[];

  @ViewChild('login', {static: false})
  loginOverlay: OverlayPanel;
  loginError: string;


  constructor(private http: HttpClient) {
    this.controllers =  [
      {label: 'Production', value: 'https://appd.metlife.com'},
      {label: 'QA', value: 'https://qa.appd.metlife.com'},
      {label: 'Dev/Lab', value: 'https://dev.appd.metlife.com'}
    ];
    this.loginForm = new FormGroup({
      url: new FormControl(''),
      uid: new FormControl(''),
      pwd: new FormControl('')
    });
  }

  ngOnInit() {
    this.http.get('/api/user')
    .subscribe(
      user => {
        this.user = user;
        this.url = this.user.url;
      },
      err => console.log(err),
      undefined
    );
  }

  doLogin(con) {
    con.pwd = xor(con.pwd);
    this.http.post('/api/login', con)
    .subscribe(
      user => {
        this.user = user;
        this.loginError = null;
        this.loginOverlay.hide();
      },
      err => {
        this.loginError = err.message;
      },
      undefined
    );
  }
  doLogout() {
    this.http.post('/api/logout', {})
    .subscribe(() => {
      this.user = null;
      console.log('LOGGED OUT', this.user);
    });
  }
}
