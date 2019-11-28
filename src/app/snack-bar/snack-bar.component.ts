import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.sass']
})
export class SnackBarComponent implements OnInit {

  constructor(private snackBar: MatSnackBar) {}

  public openSnackBar(message) {
    this.snackBar.open(message, 'Okay!', {
      duration: 5000
    });
  }

  ngOnInit() {
  }

}
