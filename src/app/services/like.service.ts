import { Injectable } from '@angular/core';
import {HomeComponent} from '../home/home.component';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  constructor(private http: HttpClient) { }

  likePost(body, home) {
    const url = 'http://localhost:8080/api/like';

    this.http.post(url, body).subscribe(data => {
      home.ngOnInit();
    });
  }

  unlikePost(postId, userId, home) {
    const url = 'http://localhost:8080/api/like/' + postId + '/' + userId;

    this.http.delete(url).subscribe(data => {
      home.ngOnInit();
    });
  }
}
