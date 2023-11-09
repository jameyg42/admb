import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { xor } from '@metlife/appd-libutils/out/crypto';
import { SelectItemGroup } from 'primeng/api';
import { LoginComponent } from 'src/app/login/login.component';

@Component({
  selector: 'admb-keygen-panel',
  templateUrl: './keygen-panel.component.html',
  styleUrls: ['./keygen-panel.component.scss']
})
export class KeygenPanelComponent {
  loginForm: UntypedFormGroup;
  controllers: SelectItemGroup[];
  apiKey:string;

  constructor() {
    const login = new LoginComponent(null);
    this.controllers = login.controllers;
    this.loginForm = login.loginForm;
  }
  doKeyGen() {
    const cred = this.loginForm.value;

    const token = {
      controller: cred.controller.url,
      account: cred.controller.account,
      username: cred.uid,
      password: xor(cred.pwd)
    }
    this.apiKey = btoa(JSON.stringify(token));

  }
}
