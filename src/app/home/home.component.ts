import {Component, OnInit} from '@angular/core';
import {PostService} from '../services/post.service';
import {Router} from '@angular/router';
import {LoginService} from '../services/login.service';
import {MatDialog} from '@angular/material';
import {PostDialogComponent} from '../post-dialog/post-dialog.component';
import {PostModel} from '../models/PostModel';
import {TagModel} from '../models/TagModel';
import {TagsService} from '../services/tags.service';
import {UserModel} from '../models/UserModel';

export interface DialogData {
  text: string;
  title: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  text = '';
  title: string;

  public tagModel;
  public input = '';
  public user;
  public posts;
  public myPosts;
  public suggested = [];
  public liked;
  public preferences;
  public noLiked;
  public noStrends;
  public userNickname;

  constructor(private postService: PostService, private router: Router, private login: LoginService, private dialog: MatDialog, private post: PostService, private tagService: TagsService) { }

  ngOnInit() {
    this.login.getUserDetails(sessionStorage.getItem('tempUser')).subscribe(result => {
      sessionStorage.setItem('activeUser', JSON.stringify(result));
      this.user = JSON.parse(sessionStorage.getItem('activeUser'));
      this.userNickname = this.user.nickname;
      this.preferences = JSON.parse(sessionStorage.getItem('activeUser')).preferences;
      this.loadLikedPosts();
    });
  }

  loadPosts() {
    this.postService.getPosts().subscribe(data => {
      this.posts = data;
      sessionStorage.setItem('posts', JSON.stringify(this.posts));
      this.loadSuggestedPosts();
      this.loadMyPosts();
    });
  }

  loadMyPosts() {
    this.postService.getMyPosts(this.userNickname).subscribe(data => {
      this.myPosts = data;
      if (this.myPosts.length === 0) {
        this.noStrends = true;
      } else {
        this.noStrends = false;
      }
    });
  }

  loadSuggestedPosts() {
    const posts = JSON.parse(sessionStorage.getItem('posts'));
    const userPreferences = JSON.parse(sessionStorage.getItem('activeUser')).preferences;

    for (const preference of userPreferences) {
      for (const post of posts) {
        if (post.tags.length !== 0) {
          for (let i = 0; i < post.tags.length; i++) {
            if (preference.name === post.tags[i].name) {
              if (!this.suggested.includes(post)) {
                this.suggested.push(post);
              }
            }
          }
        }
      }
    }
  }

  loadLikedPosts() {
    this.postService.getLikedPosts(this.user.id).subscribe(data => {
      this.liked = data;

      if (this.liked.length === 0) {
        this.noLiked = true;
      } else {
        this.noLiked = false;
      }

      sessionStorage.setItem('likedPosts', JSON.stringify(this.liked));
      this.loadPosts();
    });
  }

  logout() {
    this.router.navigate(['']);
    sessionStorage.clear();
  }

  openDialog(event): void {
    event.preventDefault();

    const dialogRef = this.dialog.open(PostDialogComponent, {
      width: '400px',
      data: {text: this.text, title: this.title}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      const user = new UserModel('', '', []);
      user.id = this.user.id;

      const post = new PostModel('A', result.text, this.getDate(), result.title, user, []);
      const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

      const loop = async () => {
        await asyncForEach(JSON.parse(sessionStorage.getItem('postTags')), async (tag) => {
          this.tagService.getExisting(tag).subscribe(rslt => {
            this.tagModel = new TagModel(rslt.name);
            this.tagModel.id = rslt.id;
            post.tags.push(this.tagModel);
          });
          await waitFor(1000);
        });

        console.log(post);
        this.postService.createPost(post, this);
      };

      loop();
      this.text = '';
    });
  }

  private getDate() {
    const d = new Date().toLocaleDateString();
    return d;
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
