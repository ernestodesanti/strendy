import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private login: LoginService) { }

  loggedInStatus = false;

  getUserDetails(nickname) {
    // post user to API
    const url = 'http://localhost:8080/api/user/find-by-nickname?nickname=' + nickname;

    return this.http.get(url);
  }

  postUser(user) {
    const url = 'http://localhost:8080/api/user';

    this.http.post(url, user).subscribe( data => {

    });
  }

}
