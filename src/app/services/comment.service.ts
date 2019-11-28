import {Injectable, QueryList, ViewChildren} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HomeComponent} from '../home/home.component';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  public userId;
  public comments;
  public postModel;
  constructor(private http: HttpClient) { }

  getComments(post) {
    // post user to API
    const url = 'http://localhost:8080/api/comment/' + post;
    return this.http.get(url);
  }

  postComment(body, home: HomeComponent) {
    const url = 'http://localhost:8080/api/comment';
    this.http.post(url, body).subscribe(data => {
      setTimeout(function () {
        home.ngOnInit();
        home.ngOnInit();
      }, 2000);
    });

  }

  updateComment(body, home: HomeComponent, commentId) {
    const url = 'http://localhost:8080/api/comment/' + commentId;
    this.http.put(url, body).subscribe(data => {
      home.ngOnInit();
    });
  }
}
