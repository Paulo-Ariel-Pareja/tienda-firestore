import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {

  constructor(
    public auth: AuthService
  ) { 
  }

  ngOnInit() {
  }

}
