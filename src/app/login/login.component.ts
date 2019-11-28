import { Component, OnInit } from '@angular/core';
import {LoginService} from '../services/login.service';
import {SnackBarComponent} from '../snack-bar/snack-bar.component';
import {UserModel} from '../models/UserModel';
import {TagsService} from '../services/tags.service';
import {TagModel} from '../models/TagModel';
import {Router} from '@angular/router';
import {PostService} from '../services/post.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
  providers: [SnackBarComponent]
})
export class LoginComponent implements OnInit {

  public userModel = new UserModel('', 'A', []);
  public tagModel;
  constructor(private login: LoginService, private snackBar: SnackBarComponent, private tagService: TagsService, private router: Router, private postService: PostService) { }

  ngOnInit() {
    sessionStorage.setItem('preferences', JSON.stringify(['Strendy']));
  }

  async loginUser(event) {
    event.preventDefault();

    const target = event.target;
    const nickname = target.querySelector('#nickname').value;
    const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

    this.login.getUserDetails(nickname).subscribe(data => {
      if (nickname !== '' && data == null && JSON.parse(sessionStorage.getItem('preferences')).length !== 0) {
        this.userModel.nickname = nickname;

        const loop = async () => {
          await asyncForEach(JSON.parse(sessionStorage.getItem('preferences')), async (tag) => {
            this.tagService.getExisting(tag).subscribe(rslt => {
              this.tagModel = new TagModel(rslt.name);
              this.tagModel.id = rslt.id;
              this.userModel.preferences.push(this.tagModel);
            });
            await waitFor(1000);
          });

          this.login.postUser(this.userModel);

          sessionStorage.setItem('tempUser', this.userModel.nickname);

          this.postService.getPosts().subscribe(response => {
            sessionStorage.setItem('posts', JSON.stringify(response));
          });

          const thisTemp = this;

          setTimeout(function () {
            thisTemp.router.navigate(['home']);
          }, 1000);
        };

        loop();
      } else if (data != null) {
        this.snackBar.openSnackBar('That nickname is already in use😔');
      } else {
        this.snackBar.openSnackBar('Please choose a nickname or choose preferences');
      }
    });

  }

}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
