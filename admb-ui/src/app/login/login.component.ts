import { Component, OnInit, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';
import { FormGroup, FormControl } from '@angular/forms';
import { LoginService } from './login.service';
import { SelectItemGroup } from 'primeng/api';

@Component({
  selector: 'admb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  controllers: SelectItemGroup[];
  blocked = false;

  @ViewChild('login')
  loginOverlay: OverlayPanel;
  loginError: string;

  constructor(private loginService: LoginService) {
    this.controllers =  [{
      label: 'On Prem', items: [
        {label: 'Production', value: {url:'https://appd.metlife.com/controller', account: 'customer1'}},
        {label: 'QA', value: {url:'https://qa.appd.metlife.com/controller', account:'customer1'}},
        {label: 'AppD-on-AppD', value: {url:'http://ustry1basv00edl.met_intnet.net:8090/controller', account: 'customer'}},
      ]},{
      label: 'SaaS', items: [
        {label: 'Production (ml-prod)', value: {url:'https://ml-prod.saas.appdynamics.com/controller', account: 'ml-prod'}},
        {label: 'QA (ml-nonprod)', value: {url:'https://ml-nonprod.saas.appdynamics.com/controller', account:'ml-nonprod'}},
      ]}
    ];
    this.loginForm = new FormGroup({
      controller: new FormControl(this.controllers[0].value),
      uid: new FormControl(''),
      pwd: new FormControl('')
    });
  }

  ngOnInit() {
    this.loginForm.patchValue({
      controller: {url:'https://appd.metlife.com/controller', account: 'customer1'}
    });
  }

  doLogin() {
    const con = this.loginForm.value;
    this.blocked = true;
    this.loginService
      .login(con.controller.url, con.controller.account, con.uid, con.pwd)
      .then(() => {
        this.loginError = null;
        this.blocked = false;
      })
      .catch(err => {
        console.log(err);
        this.blocked = false;
        this.loginError = 'Invalid Login';
      });
  }
}
