import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackService {

  private snackBarOptions: MatSnackBarConfig = new MatSnackBarConfig;

  constructor(
    private snackBar: MatSnackBar
  ) { }

  launch(menssage: string, action: string, duration: number){
    this.snackBarOptions.duration = duration;
    this.snackBar.open(menssage, action, this.snackBarOptions);
  }
}
