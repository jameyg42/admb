import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import * as xor from '../../xor';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private userChange = new Subject();
  userChange$ = this.userChange.asObservable();

  constructor(private http: HttpClient) {
  }

  currentUser() {
    return new Promise((resolve, reject) => {
      this.http.get('/api/user').subscribe(
        user => resolve(user),
        err => reject(err),
        undefined
      );
    });
  }

  login(url, uid, pwd) {
    return new Promise((resolve, reject) => {
      this.http.post('/api/login', {
        url,
        uid,
        pwd: xor(pwd)
      }).subscribe(
        user => {
          this.userChange.next(user);
          resolve(user);
        },
        err => {
          reject(err);
        },
        undefined
      );
    });
  }
  logout() {
    return new Promise((resolve, reject) => {
      this.http.post('/api/logout', {})
        .subscribe(
          ok => {
            this.userChange.next(null);
            resolve("logged-out");
          },
          err => reject(err),
          undefined
        );
    });
  }
}
