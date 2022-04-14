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
      {label: 'Production (OnPrem)', value: {url:'https://appd.metlife.com/controller', account: 'customer1'}},
      {label: 'Production (SaaS)', value: {url:'https://ml-prod.saas.appdynamics.com/controller', account: 'ml-prod'}},
      {label: 'QA (OnPrem)', value: {url:'https://qa.appd.metlife.com/controller', account:'customer1'}},
      {label: 'QA (SaaS)', value: {url:'https://ml-nonprod.saas.appdynamics.com/controller', account:'ml-nonprod'}},
      {label: 'AppD-on-AppD', value: {url:'http://ustry1basv00edl.met_intnet.net:8090/controller', account: 'customer'}},
    ];
    this.loginForm = new FormGroup({
      controller: new FormControl(this.controllers[0].value),
      uid: new FormControl(''),
      pwd: new FormControl('')
    });
  }

  ngOnInit() {
  }

  doLogin() {
    const con = this.loginForm.value;
    this.loginService
      .login(con.controller.url, con.controller.account, con.uid, con.pwd)
      .then(() => this.loginError = null)
      .catch(err => {
        console.log(err);
        this.loginError = 'Invalid Login';
      });
  }
}
