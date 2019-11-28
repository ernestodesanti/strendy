import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import {LoginService} from '../services/login.service';
import {Router} from '@angular/router';
import {SnackBarComponent} from '../snack-bar/snack-bar.component';

export interface DialogData {
  nickname: string;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.sass'],
  providers: [SnackBarComponent]
})
export class LandingPageComponent implements OnInit {

  private user;
  nickname: string;

  constructor(public dialog: MatDialog, private login: LoginService, private router: Router, private snackBar: SnackBarComponent) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {nickname: this.nickname}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.nickname = result;

      if (result === undefined) {
      } else {
        this.login.getUserDetails(this.nickname).subscribe(data => {
          this.user = data;
          if (this.user != null) {
            sessionStorage.setItem('tempUser', this.user.nickname);
            sessionStorage.setItem('activeUser', JSON.stringify(this.user));
            this.router.navigate(['home']);
          } else {
            this.snackBar.openSnackBar('That nickname does not exist');
          }
        });
      }
    });
  }

  ngOnInit() {
  }

}
