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

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }
  doLogout() {
    this.loginService.logout();
  }


}
