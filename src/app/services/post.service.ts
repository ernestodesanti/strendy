import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  getPosts(): Observable<any[]> {
    const url = 'http://localhost:8080/api/post';

    return this.http.get<any[]>(url);
  }

  getMyPosts(nickname): Observable<any[]> {
    const url = 'http://localhost:8080/api/post/find-by-user?nickname=' + nickname;

    return this.http.get<any[]>(url);
  }

  getLikedPosts(userId): Observable<any[]> {
    const url = 'http://localhost:8080/api/post/find-liked/' + userId;

    return this.http.get<any[]>(url);
  }

  createPost(post, thisI) {
    const url = 'http://localhost:8080/api/post';

    this.http.post(url, post).subscribe( data => {
      thisI.ngOnInit();
    });
  }
}
