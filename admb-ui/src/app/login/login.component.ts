import { Component, OnInit, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { LoginService } from './login.service';
import { SelectItem, SelectItemGroup } from 'primeng/api';
import { AdmbControllerDef } from '@admb/admb-server/out/config';

@Component({
  selector: 'admb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  controllers: SelectItemGroup[] | SelectItem[] = [];
  blocked = false;

  @ViewChild('login')
  loginOverlay: OverlayPanel;
  loginError: string;

  constructor(private loginService: LoginService) {
    this.loginForm = new UntypedFormGroup({
      controller: new UntypedFormControl({}),
      uid: new UntypedFormControl(''),
      pwd: new UntypedFormControl('')
    });
  }

  ngOnInit() {
    this.loginService.getControllerList().then(controllerDefs => {
      this.setControllersFromDefs(controllerDefs);
      const selected = this.controllersAreGrouped ? (this.controllers as SelectItemGroup[])[0].items[0] : this.controllers[0];
      this.loginForm.patchValue({
        controller: selected.value
      });
    });
  }
  setControllersFromDefs(defs:AdmbControllerDef[]) {
    const toItem = (d:AdmbControllerDef):SelectItem => {
      return {
        label: d.name,
        value: {url: d.url, account: d.account}
      }
    } 
    if (defs.some(d => d.group)) {
      defs.forEach(def => {
        if (!def.group) def.group = 'Other'
      });
      const groups = [...new Set(defs.map(d => d.group))];
      this.controllers = groups.map(g => ({
        label: g,
        items: defs.filter(d => d.group == g).map(d => toItem(d))
      }));
    } else {
      this.controllers = defs.map(d => toItem(d));
    }
  }
  get controllersAreGrouped(): boolean {
    return this.controllers?.length > 0 && 'items' in this.controllers[0];
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
        console.error(err);
        this.blocked = false;
        this.loginError = 'Invalid Login';
      });
  }
}
