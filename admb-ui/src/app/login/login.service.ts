import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { xor } from "@admb/libutils/out/crypto";
import { AdmbControllerDef } from '@admb/admb-server/out/config';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private userChange = new Subject<any>();
  userChange$ = this.userChange.asObservable();

  constructor(private http: HttpClient) {}

  getControllerList():Promise<AdmbControllerDef[]> {
    return new Promise((resolve, reject) => {
      this.http.get<AdmbControllerDef[]>('/api/controllers')
      .subscribe({
        next: (controllers) => resolve(controllers),
        error: (err) => reject(err)
      })
    });
  }

  currentUser() {
    return new Promise((resolve, reject) => {
      this.http.get('/api/user').subscribe({
        next: (user) => resolve(user),
        error: (err) => reject(err)
      });
    });
  }

  login(url, account, uid, pwd) {
    return new Promise((resolve, reject) => {
      this.http.post('/api/login', {
        url,
        account,
        uid,
        pwd: xor(pwd)
      })
      .subscribe({
        next: (user) => {
          this.userChange.next(user);
          resolve(user);
        },
        error: (err) => reject(err)
      });
    });
  }
  logout() {
    return new Promise((resolve, reject) => {
      this.http.post('/api/logout', {})
      .subscribe({
        next: () => {
          this.userChange.next(null);
          resolve("logged-out");
        },
        error: (err) => reject(err)
      });
    });
  }
}
