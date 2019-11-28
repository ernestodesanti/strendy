import {Component, Input, OnInit} from '@angular/core';
import {PostService} from '../services/post.service';
import {LikeService} from '../services/like.service';
import {HomeComponent} from '../home/home.component';

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.sass']
})
export class LikeComponent implements OnInit {

  @Input() post;
  public activeUser;
  public likedPosts;
  public color;

  constructor(private postService: PostService, private likeService: LikeService, private home: HomeComponent) { }

  ngOnInit() {
    this.activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
    this.likedPosts = JSON.parse(sessionStorage.getItem('likedPosts'));
  }

  checkLike() {
    if (this.likedPosts != null) {
      for (const likedPost of this.likedPosts) {
        if (this.post === likedPost.id) {
          this.color = {
            'color': '#F44336'
          };
        }
      }
    }

    return this.color;
  }

  likeUnlikePost(event) {
    event.preventDefault();

    const likeIcon = event.target;

    console.log(likeIcon.style.color);

    const like = '{"post": {"id":' + this.post + '}, "user": {"id":' + this.activeUser.id + '}}'

    if (likeIcon.style.color === 'rgb(244, 67, 54)') {
      this.likeService.unlikePost(this.post, this.activeUser.id, this.home);
      likeIcon.style.color = 'rgba(0,0,0,.87)';
    } else {
      this.likeService.likePost(JSON.parse(like), this.home);
      likeIcon.style.color = 'rgb(244, 67, 54)';
    }
  }

}
