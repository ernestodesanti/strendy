import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CommentService} from '../services/comment.service';
import {HomeComponent} from '../home/home.component';
import {SnackBarComponent} from '../snack-bar/snack-bar.component';
import {MatAccordion, MatDialog} from '@angular/material';
import {CommentDialogComponent} from '../comment-dialog/comment-dialog.component';

export interface DialogData {
  comment: string;
}

@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.sass'],
  providers: [SnackBarComponent]
})
export class PostCommentComponent implements OnInit {

  @Input() post;
  public activeUser;
  public comments;
  comment: string;

  constructor(private commentService: CommentService, private home: HomeComponent, private snackBar: SnackBarComponent, private dialog: MatDialog) { }

  ngOnInit() {
    this.activeUser = JSON.parse(sessionStorage.getItem('activeUser')).nickname;
    this.loadComments();
  }

  loadComments() {
    this.commentService.getComments(this.post).subscribe(data => {
      this.comments = data;
    });
  }

  createComment(event) {
    event.preventDefault();

    const target = event.target;
    const comment = target.querySelector('#comment').value;

    if (comment !== '') {
      const userId = JSON.parse(sessionStorage.getItem('activeUser')).id;

      const body = '{"comment": "' + comment + '","timestamp" : "' + this.getDate() + '","post": {"id":' + this.post +
        '},"user": {"id":' + userId + '}}';

      this.commentService.postComment(JSON.parse(body), this.home);

      this.comments.push(JSON.parse(body));
    }

    this.snackBar.openSnackBar('Your comment was saved😄');
    target.querySelector('#comment').value = '';
  }

  updateComment(comment, commentId) {
    if (comment !== '') {
      const userId = JSON.parse(sessionStorage.getItem('activeUser')).id;

      const body = '{"comment": "' + comment + '","timestamp" : "' + this.getDate() + '","post": {"id":' + this.post + '},"user": {"id":' + userId + '}}';

      this.commentService.updateComment(JSON.parse(body), this.home, commentId);
      this.snackBar.openSnackBar('Your comment was updated😄');
    }
  }

  openDialog(event, commentId): void {
    event.preventDefault();

    try {
      const target = event.target;
      this.comment = target.parentElement.parentElement.childNodes[2].childNodes[2].innerHTML;

      const dialogRef = this.dialog.open(CommentDialogComponent, {
        width: '350px',
        data: {comment: this.comment}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === undefined) {
        } else {
          this.updateComment(result, commentId);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  private getDate() {
    const d = new Date().toLocaleDateString();
    return d;
  }

}
