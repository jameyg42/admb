import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'admb-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @Input()
  user: any;

  beatInterval: any;

  constructor(private loginService: LoginService) {
    this.sessionBeatEnabled = storage.get('sessionBeatEnabled');
  }

  ngOnInit(): void {
  }
  doLogout() {
    this.loginService.logout();
  }

  set sessionBeatEnabled(enabled: boolean) {
    if (this.beatInterval) {
      clearInterval(this.beatInterval);
      this.beatInterval = null;
    }
    if (enabled) {
      this.beatInterval = setInterval(() => this.loginService.currentUser(), 1 * 60 * 1000);
    }
    storage.put('sessionBeatEnabled', enabled);
  }
  get sessionBeatEnabled(): boolean {
    return this.beatInterval != null;
  }
}


const storageKey = 'metlife.admb.session';
const storage = {
  get: (key) => {
    return localStorage ? JSON.parse(localStorage.getItem(`${storageKey}.${key}`)) || null : null;
  },
  put: (key, val) => {
    localStorage && localStorage.setItem(`${storageKey}.${key}`, JSON.stringify(val));
  }
};
