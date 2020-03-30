import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';
import { FormGroup, FormControl } from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'admb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  controllers: SelectItem[];

  @ViewChild('login')
  loginOverlay: OverlayPanel;
  loginError: string;

  constructor(private loginService: LoginService) {
    this.controllers =  [
      {label: 'Production', value: 'https://appd.metlife.com'},
      {label: 'QA', value: 'https://qa.appd.metlife.com'},
      {label: 'Dev/Lab', value: 'https://dev.appd.metlife.com'}
    ];
    this.loginForm = new FormGroup({
      url: new FormControl(this.controllers[0].value),
      uid: new FormControl(''),
      pwd: new FormControl('')
    });
  }

  ngOnInit() {
  }

  doLogin() {
    const con = this.loginForm.value;
    this.loginService
      .login(con.url, con.uid, con.pwd)
      .catch(err => {

      });
  }
}
